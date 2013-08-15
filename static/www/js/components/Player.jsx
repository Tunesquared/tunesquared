/** @jsx React.DOM */
'use strict';

/* TODO : preloading and fade transition.
  There's already two players and part of the 'transition' logic is implemented
  TODO : we could event display buffering status oO
*/

/*
  Master player component. Controls hidden players as well as the song flow.
  It takes consumes the playlist. To give the player a song, one must simply
  add it to the playlist. One cannot force a song to go in the player, it has
  to be first in the playlist at the moment songs are switched.
*/
define(['react', 'jquery', 'players/PlayerFactory', 'mixins/persist', 'bootstrap-slider'],
  function (React, jquery, PlayerFactory, persist) {

  var PROGRESS_STEP = 1000;

	var Player = React.createClass({

    mixins: [persist],

    persistId: 'player',

    getInitialState: function () {
      /* States for the player are : 'empty', it waits for a new song to come in and start */
      return {
        /* When true, music is playing or will be as soon as the player will be fed with a song.
          Therefore, there exists a state where playing is true but no song is loaded. */
        playing: false,

        /* Volume is stored in player state so that it actually acts as a master
         and can keep it consistent across different player implementations */
        volume: 50,

        /* Player in foreground it's state is linked to the UI (loading, progress, etc...) */
        currentPlayer: null,

        /*
          Player in background, this one preloads the next track and, if there is time,
          contributes to the "smooth transition". It's state is never shown, it replaces currentPlayer
          when current song is skipped or ends.
          Assert : There can not be a nextPlayer if currentPlayer == null
        */
        nextPlayer: null,

        currentSong: null,


        loading: false,

        progress: 0
      };
    },

    componentDidMount: function () {
      var errors = PlayerFactory.checkCompatibility();
      // TODO : handle compatibility error
      if(errors){
        console.error('Compatibility errors');
        console.log(errors);
      }

      $(this.getDOMNode()).delegate('[data-ref="volume-slider"]', 'slide', this.onVolumeChange);
      $(this.getDOMNode()).delegate('[data-ref="progress-slider"]', 'slideStart', this.onProgressStart);
      $(this.getDOMNode()).delegate('[data-ref="progress-slider"]', 'slideStop', this.onProgressStop);

      this._timeout = setInterval(this.watchProgress, 1000);
    },

    componentWillUnmount: function () {
      clearInterval(this._timeout);
    },

    componentWillReceiveProps: function (newProps) {
      if (this.props.party.get('playlist') && newProps.party.get('playlist') && this.props.party.get('playlist') !== newProps.party.get('playlist')) {
        this.props.party.get('playlist').off(null, null, this);

        var stored = this.load();
        this.setState({
          volume: stored.volume || 50
        });

        var playlist = newProps.party.get('playlist');

        var song = playlist.get(stored.currentSong);
        if (song != null) {
          newProps.party.set('currentSong', song);
          this.onNextSong(song, {seek: stored.seek});
        } else {
          song = playlist.get(newProps.party.get('currentSong'));
          if (song != null) {
            this.onNextSong(song);
          } else {
            this.fetchPlaylistForNextSong(newProps.party.get('playlist'));
          }
        }
      }
    },

		componentDidUpdate: function(){
      if (this.state.currentPlayer != null){
        var volume = $(this.refs['volume-slider'].getDOMNode())
          .slider({
            max: 100,
            min: 0,
            tooltip: 'hide'
          });

        if(volume.slider('getValue') !== this.state.volume)
          volume.slider('setValue', this.state.volume);

        var progress = $(this.refs['progress-slider'].getDOMNode()).slider({
          max: PROGRESS_STEP,
          min: 0,
          formater: this.progressFormatter
        });
        if(progress.slider('getValue') !== this.state.progress)
          progress.slider('setValue', this.state.progress * PROGRESS_STEP);

        this.state.currentPlayer.setVolume(this.state.volume);

        if(this.state.nextPlayer != null){
          this.state.nextPlayer.setVolume(this.state.volume);
        }

        this.save({
          volume: this.state.volume,
          seek: this.state.progress * 1000 * this.state.currentPlayer.getDuration() / PROGRESS_STEP
        });
      }
		},

    // Formats raw progress bar value to printable value
    progressFormatter: function(val) {
      var secs = Math.round((this.state.currentPlayer.getDuration() * val/PROGRESS_STEP)/1000);
      return ('00' + Math.round((secs/60))).substr(-2) + ':' + ('00' + (secs % 60)).substr(-2);
    },

    /*
      Tries to extract next song from the playlist.
      If it fails, listen to playlist's 'add' event to retry
    */
    fetchPlaylistForNextSong: function (playlist) {
      console.log('fetching playlist');

      if (playlist == null)
        playlist = this.props.party.get('playlist');

      if (playlist.length === 0){
        console.log('try again');
        playlist.once('add', function() {
          this.fetchPlaylistForNextSong(playlist);
        }.bind(this));
      } else {
        var song = playlist.first();
        this.onNextSong(song);
      }
    },

    /* Called by fetchPlaylistForNextSong when it actually fetched a song from the playlist */
    onNextSong: function (song, options) {
      console.log('houra, song available : ');
      console.log(song);

      var anchor = document.createElement('div');
      anchor.style.position = 'absolute';
      anchor.style.top = '-1000px';
      document.body.appendChild(anchor);

      if(this.state.currentPlayer == null)
        this.setState({loading: true});

      PlayerFactory.create(song, anchor, function (err, player) {
        if(err) throw err; // TODO : handle error


        /* Exposes the player to make tests, very handy ;) */
        window.player = player;

        // Initialize slave player with master state
        player.setVolume(this.state.volume);
        if(this.state.playing) player.play();
        else player.pause();

        if (this.state.currentPlayer == null){
          this.props.onNewCurrentPlayer(player);
          player.on('end', this.onPlayerEnd);
          player.on('play', this.onPlayerPlay);
          player.on('pause', this.onPlayerPause);

          console.log('setting song : '+song);
          this.props.party.set('currentSong', song);

          if (options) {
            console.log(options);
            console.log(player.getDuration());
            if (options.seek)
              player.seekTo(options.seek);
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
      }.bind(this));
    },

    onPlayerEnd: function() {
      this.state.currentPlayer.song.destroy(); // removes song from playlist
      this.props.party.set('currentSong', null); // removes song from currentSong property

      // Players internals are sometimes a bit shitty so we give'em some help for memory management
      this.state.currentPlayer.release();

      this.setState({
        currentPlayer: null
      });

      // Then try to get a new one AFTER new state has been applied
      _.defer(this.fetchPlaylistForNextSong);
    },

    onPlayerPlay: function () {
      this.setState({
        playing: true
      });
    },

    onPlayerPause: function () {
      this.setState({
        playing: false
      });
    },

    onPlay: function (evt) {
      evt.preventDefault();
      if(this.state.currentPlayer);
        this.state.currentPlayer.play();
    },

    onPause: function (evt) {
      evt.preventDefault();
      if(this.state.currentPlayer);
        this.state.currentPlayer.pause();
    },

    onSkip: function(evt){
      evt.preventDefault();
      this.onPlayerEnd();
    },

    onVolumeChange: function(e) {

      this.setState({
        volume: e.value
      });
    },

    onProgressStart: function () {
      this._progressDrag = true;
    },

    onProgressStop: function (e) {
      this._progressDrag = false;
      var player = this.state.currentPlayer;
      if(player){
        player.seekTo(player.getDuration() * e.value/PROGRESS_STEP);
      }
    },



    watchProgress: function() {
      if ( this.state.currentPlayer != null && !this._progressDrag){
        this.setState({
          progress: this.state.currentPlayer.getProgress()
        });
      }
    },

		render: function () {

      var contents;

      if (this.state.currentPlayer != null) {
        var song = this.state.currentPlayer.song;

        var playButton = this.state.playing ?
            <a href="#" class="btn btn-primary play-button player-control" onClick={this.onPause}><i class="icon-pause"></i></a> :
            <a href="#" class="btn btn-primary play-button player-control" onClick={this.onPlay}><i class="icon-play"></i></a>;

        contents = (
          <div class="media">
            <div class="pull-left">
              {playButton}
              <a href="#" class="btn btn-default forward-button player-control" ref="fwd-button" onClick={this.onSkip}>
                <i class="icon-fast-forward"></i>
              </a><br />
              <i class="pull-left icon-volume-up volume-icon"></i>
              <div class="volume-slider"  data-ref="volume-slider" ref="volume-slider"></div><br />
            </div>
            <a class="pull-left" href="#">
              <img class="media-object" src={this.state.currentPlayer.song.get('thumb')} />
            </a>
            <div class="media-body">
              <div class="player-song-title">
                <h4 class="media-heading">{this.state.currentPlayer.song.get('title')}</h4>
                by {this.state.currentPlayer.song.get('artist')}
              </div>
              <div data-ref="progress-slider" ref="progress-slider"></div>
            </div>
          </div>);
      } else if (this.state.loading){
        contents = <img src="img/ajax-loader.gif" />;
      } else {
        contents = 'Nothing to play. Add some songs to get started.';
      }

			return <div id="player">
        {contents}
      </div>;
		}
	});

	return Player;
});
