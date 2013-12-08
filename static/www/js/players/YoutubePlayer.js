'use strict';


/*
    Youtube player wrapper.
*/

define(['underscore', 'players/LayoutManager', 'players/Player', 'noext!//www.youtube.com/iframe_api'],
  function (_, LayoutManager, Player) {
    var YT = window.YT;

    var PlayerState = {
      UNSTARTED: -1,
      ENDED: 0,
      PLAYING: 1,
      PAUSED: 2,
      BUFFERING: 3,
      CUED: 4
    };

    // Internal counter used to generate ids, since we are going to pollute global namespace
    var counter = 0;

    /*
        --- Constructor ---
    */
    function YoutubePlayer(song, element, ready) {
      Player.apply(this, arguments);

      _.bindAll(this, 'onReady', 'onStateChange', 'fixSeek');
      /*
            We want the attributes to be modified when resizing, not the css. This is
            because we create an "object" DOM node which takes "width" and "height"
            attributes. For normal DOM nodes, we would use css's "height" and "width".
        */
      this.layout = {
        resizeMethod: 'attr'
      };

      // Saves the ready callback for later use
      this._loadCb = ready;

      /* We keep our own seekTime because youtube player resets it's own seek time
            on start. This variable allows us to keep state consistent during this phase
            (see Player.seekTo)
        */
      this._seekTime = 0;

      // Remembers if seek time was buffered
      this._seekBuffered = false;

      // Creates a target
      var target = document.createElement('div');
      target.id = 'youtube_host' + counter;
      element.appendChild(target);



      this._player = new YT.Player(target.id, {
        height: '200',
        width: '200',
        videoId: song.get('data'),
        playerVars: {
          'autoplay': 1,
          'controls': 0
        },
        events: {
          'onReady': this.onReady,
          'onStateChange': this.onStateChange
        }
      });

    }

    _.extend(YoutubePlayer.prototype, Player.prototype);
    _.extend(YoutubePlayer, Player);

    /* This name must match the source name (in search) so that the factory
        knows which player to use for each song */
    YoutubePlayer.sourceName = 'youtube';

    /* Returns a string with error explanation if there is a compatibility issue. */
    YoutubePlayer.checkCompatibility = function () {};



    YoutubePlayer.prototype.onReady = function ( /* event */ ) {
      this._loadCb(null, this);
    };


    // Controls :

    YoutubePlayer.prototype.play = function () {
      console.log('play');
      this._player.playVideo();
    };

    YoutubePlayer.prototype.pause = function () {
      this._player.pauseVideo();
    };

    YoutubePlayer.prototype.stop = function () {
      this._player.stopVideo();
    };

    // Volume 0 - 100
    YoutubePlayer.prototype.setVolume = function (vol) {
      this._player.setVolume(vol);
    };

    // Seeks to time in msecs
    YoutubePlayer.prototype.seekTo = function (time) {
      console.log('seek');
      if (this._player.getPlayerState() === PlayerState.UNSTARTED) {
        console.log('buffered');
        this._seekTime = time;
        this._seekBuffered = true;
      }
      this._player.seekTo(Math.floor(time / 1000), true);
    };

    // Getters :

    // Returns current time in msec
    YoutubePlayer.prototype.getSeekTime = function () {
      /* We must check that player has already started or we will ruin the reason
            why we use our stateful variable _seekTime */
      if (this._player.getPlayerState() !== PlayerState.UNSTARTED)
        this._seekTime = this._player.getCurrentTime() * 1000;

      return this._seekTime;
    };

    YoutubePlayer.prototype.getDuration = function () {
      return this._player.getDuration() * 1000;
    };

    YoutubePlayer.prototype.getState = function () {
      return (this._player.getPlayerState() === PlayerState.PLAYING ||
        this._player.getPlayerState() === PlayerState.BUFFERING) ?
        'playing' : 'stopped';
    };

    YoutubePlayer.prototype.release = function () {

    };



    // Implementation specific methods

    /*
        Messages from the youtube player to the app.
    */
    YoutubePlayer.prototype.onStateChange = function (event) {
      var state = event.data;
      console.log('state change : ' + state);
      if (state === PlayerState.PLAYING) {
        this.trigger('play');

        // Fixes the seekTo issue
        if (this._seekBuffered === true) {
          this.fixSeek(this._seekTime);
        }

      } else if (state === PlayerState.PAUSED) {
        this.trigger('pause');

        // Fixes the seekTo issue
        if (this._seekBuffered === true) {
          setTimeout(this.fixSeek(this._seekTime), 1000);
        }
      } else if (state === PlayerState.ENDED) {
        this.trigger('end');
      }
    };

    /*
        Bad messages from the youtube player to the app.
    */
    YoutubePlayer.prototype.onError = function (err) {
      throw new Error('youtube error : ' + err);
    };

    YoutubePlayer.prototype.fixSeek = function(time) {
      console.log('seeking to ' + time);
      this._seekBuffered = false;
      this.seekTo(time);

      var self = this;
      return function(){ self.fixSeek(time) };
    };



    return YoutubePlayer;
  });
