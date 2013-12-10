/* PlaybackController.js */


define(
  ['underscore',
    'backbone',
    'mixins/persist',
    'players/PlayerFactory',
    'players/LayoutProxy'
  ],
  function (_, Backbone, persist, PlayerFactory, LayoutProxy) {

    'use strict';

    function PlaybackController(party) {
      var stored = this.load();
      var playlist = party.get('playlist');

      _.bindAll(this, 'watchProgress', 'fetchPlaylistForNextSong', 'onCreatePlayer');

      this._party = party;

      this.state = {
        /* When true, music is playing or will be as soon as the player will be fed with a song.
          Therefore, there exists a state where playing is true but no song is loaded. */
        playing: (stored.playing != null) ? stored.playing : true,

        /* Volume is stored in player state so that it actually acts as a master
         and can keep it consistent across different player implementations */
        volume: stored.volume || 50,

        /* Player in foreground it's state is linked to the UI (loading, progress, etc...) */
        currentPlayer: null,

        progress: 0,

        /*
          Player in background, this one preloads the next track and, if there is time,
          contributes to the "smooth transition". It's state is never shown, it replaces currentPlayer
          when current song is skipped or ends.
          Assert : There can not be a nextPlayer if currentPlayer == null
        */
        nextPlayer: null,

        currentSong: null,

        loading: false
      };

      // We try to get stored current song
      var song = playlist.get(stored.currentSong);
      if (song != null) {
        this.onNextSong(song, {
          seek: stored.seek
        });
      }
      // if we cannot
      else {
        // We try to get current song from party
        song = playlist.get(party.get('currentSong'));
        if (song != null) {
          this.onNextSong(song);
        } else {
          // And if we cannot, then we retreive natural next song
          this.fetchPlaylistForNextSong(party.get('playlist'));
        }
      }

      this._timeout = setInterval(this.watchProgress, 1000);
    }

    PlaybackController.prototype.fetchPlaylistForNextSong = function (playlist) {
      console.log('fetching playlist');

      if (playlist == null)
        playlist = this._party.get('playlist');

      if (playlist.length === 0) {
        // If we cannot get a new player right now, we discard current visualisation
        // Otherwise, we let onNextSong handle it
        LayoutProxy.setLayout(null);

        console.log('try again');
        playlist.once('add', function () {
          this.fetchPlaylistForNextSong(playlist);
        }, this);
      } else {
        var song = playlist.first();
        this.onNextSong(song);
      }
    };

    PlaybackController.prototype.onNextSong = function (song, options) {
      console.log('houra, song available : ');
      console.log(song);

      var anchor = document.createElement('div');
      anchor.style.position = 'absolute';
      anchor.style.top = '-1000px';
      document.body.appendChild(anchor);

      if (this.state.currentPlayer == null)
        this.setState({
          loading: true
        });

      PlayerFactory.create(song, anchor, this.onCreatePlayer, options);
    };

    PlaybackController.prototype.onCreatePlayer = function (err, player, options) {
      if (err) throw err; // TODO : handle error

      var song = player.song;

      /* Exposes the player to make tests, very handy ;) */
      window.player = player;

      // Initialize slave player with master state
      player.setVolume(this.state.volume);
      if (this.state.playing) player.play();
      else player.pause();

      if (this.state.currentPlayer == null) {

        player.on('end', this.onPlayerEnd, this);
        player.on('play', this.onPlayerPlay, this);
        player.on('pause', this.onPlayerPause, this);

        //player.play(); // autoplay

        console.log('setting song : ' + song);
        this._party.set('currentSong', song);

        /* sets new visualisation layout manager */
        LayoutProxy.setLayout(player.getLayoutManager());

        if (options) {
          if (options.seek) {
            player.seekTo(options.seek);
          }
        }

        this.save({
          currentSong: song.id
        });

        this.setState({
          currentPlayer: player,
          loading: false
        });
      } else if (this.state.nextPlayer == null) {
        console.log('got next player');
        this.setState({
          nextPlayer: player
        });
        player.pause();
      } else {
        throw new Error('Woops, I fetched a song from playlist but I already have two players :-o');
      }
    };

    PlaybackController.prototype.setState = function (newState) {
      var oldState = this.state;
      this.state = _.defaults(newState, oldState);

      this.trigger('stateChange', this.state, oldState);
    };

    PlaybackController.prototype.onPlayerEnd = function () {
      var player = this.state.currentPlayer;
      player.song.destroy(); // removes song from playlist
      this._party.set('currentSong', null); // removes song from currentSong property

      // Players internals are sometimes a bit shitty so we give'em some help for memory management
      player.release();
      player.off(null, null, this);
      player.el.parentNode.removeChild(player.el);

      this.setState({
        currentPlayer: null
      });

      // Then try to get a new one AFTER new state has been applied
      _.defer(this.fetchPlaylistForNextSong);
    };

    PlaybackController.prototype.onPlayerPlay = function () {
      this.setState({
        playing: true
      });

      this.save({
        playing: true
      });
    };

    PlaybackController.prototype.onPlayerPause = function () {
      this.setState({
        playing: false
      });

      this.save({
        playing: false
      });
    };

    PlaybackController.prototype.watchProgress = function () {
      if (this.state.currentPlayer != null) {
        this.setState({
          progress: this.state.currentPlayer.getProgress()
        });
        this.save({
          volume: this.state.volume,
          seek: this.state.progress * this.state.currentPlayer.getDuration()
        });
      }
    };


    PlaybackController.prototype.persistId = 'player';

    _.extend(PlaybackController.prototype, persist);
    _.extend(PlaybackController.prototype, Backbone.Events);

    return PlaybackController;
  });
