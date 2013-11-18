'use strict';

define(['underscore', 'backbone', 'swfobject', 'players/LayoutManager'],
	function (_, Backbone, swfobject, LayoutManager) {

	var MIN_FLASH_VERSION = '10.1';

	var PlayerState = {
		ENDED: 0,
		PLAYING: 1,
		PAUSED: 2,
		BUFFERING: 3,
		CUED: 4
	};

	var FLASH_PARAMS = {
		allowScriptAccess: 'always'
	};

	// Internal counter used to generate ids
	var counter = 0;

	window.onYouTubePlayerReady = function (playerId) {
		var ytplayer = document.getElementById('ytplayer_' + playerId);

		var player = loadingPlayers[playerId];

		if (player == null) {
			ytplayer.parentNode.removeChild(ytplayer);
		} else {
			player.onLoad(ytplayer);
			delete loadingPlayers[playerId];
		}
	};

	// hash of player instances waiting for their beloved YT player.
	var loadingPlayers = {};


	/* Awesome utility that allows us to use player's methods as youtube callbacks,
		avoiding all troubles with global shit and exceptions vanishing in the nothingness. */
	function makeYTCallback(ctx, name) {
		var cbName = 'yt_'+ctx._id+name;
		window[cbName] = function () {
			try {
				ctx[name].apply(ctx, arguments);
			} catch (e) {
				console.error({msg: e.message, stk: e.stack.split('\n')});
			}
		};
		return cbName;
	}

	function freeYTCallback(ctx, name) {
		delete window['yt_'+ctx._id+name];
	}

	/**
		Creates a player for the given song attached to the givent html element
		*/

	function YoutubePlayer(song, element, ready) {

		// Mandatory : must save the song as this.song !
		this.song = song;
		this.el = element;

		this.layoutManager = new LayoutManager(this.el, {
			resizeMethod: 'attr'
		});

		// Saves a local copy of unique count and increments
		this._id = counter++;
		this._loadCb = ready;
		this._seekTime = 0;
		this._loading = true;

		var target = document.createElement('div');
		target.id = 'youtube_host' + counter;
		element.appendChild(target);

		loadingPlayers[this._id] = this;


		swfobject.embedSWF(
			'http://www.youtube.com/apiplayer?enablejsapi=1&version=3&playerapiid=' + this._id,
			target.id,
			200,
			200,
			MIN_FLASH_VERSION,
			null, //express install
			null, //flashvars
			FLASH_PARAMS, {
				id: 'ytplayer_' + this._id
			},
			function (e) {
				if (!e.success) {
					delete loadingPlayers[this._id];
					ready('Problem embedding youtube player');
				}
			}.bind(this));
	}

	/* Events :
		'play'
		'pause'
		'stop'
		'end'
	*/
	_.extend(YoutubePlayer.prototype, Backbone.Events);

	/* This name must match the source name (in search) so that the factory
		knows which player to use for each song */
	YoutubePlayer.sourceName = 'youtube';

	/* Returns a string with error explanation if there is a compatibility issue. */
	YoutubePlayer.checkCompatibility = function () {
		if (!swfobject.hasFlashPlayerVersion(MIN_FLASH_VERSION)) {
			return 'flash player >= ' + MIN_FLASH_VERSION + ' is required';
		}
	};

	// Controls :

	YoutubePlayer.prototype.play = function () {
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
		if (this._loading){
			this._seekTime = time;
		}
		this._player.seekTo(Math.floor(time / 1000), true);
	};

	// Getters :

	// Returns current time in msec
	YoutubePlayer.prototype.getSeekTime = function () {
		this.seekTime = this._player.getCurrentTime() * 1000;
		return this._seekTime;
	};

	YoutubePlayer.prototype.getDuration = function () {
		return this._player.getDuration() * 1000;
	};

	YoutubePlayer.prototype.getProgress = function () {
		return this._player.getCurrentTime() / this._player.getDuration();
	};

	YoutubePlayer.prototype.getState = function () {
		return (this._player.getPlayerState() === 1 || this._player.getPlayerState() === 3) ?
			'playing' : 'stopped';
	};

	YoutubePlayer.prototype.getLayoutManager = function() {
		return this.layoutManager;
	};

	YoutubePlayer.prototype.release = function () {
		this.el.parentNode.removeChild(this.el);
		this.off();
		freeYTCallback(this, 'onStateChange');
		freeYTCallback(this, 'onError');
	};



	// Implementation specific methods

	YoutubePlayer.prototype.onLoad = function (ytPlayer) {
		console.log(this.song.get('data'));
		this._player = ytPlayer;

		this._player.addEventListener('onStateChange', makeYTCallback(this, 'onStateChange'));
		this._player.addEventListener('onError', makeYTCallback(this, 'onError'));
		this._loadCb(null, this);

		ytPlayer.loadVideoById(this.song.get('data'), 0, 'large');
	};

	YoutubePlayer.prototype.onStateChange = function (state) {
		console.log('state change : ' + state);
		if (state === PlayerState.PLAYING) {
			this.trigger('play');
			if (this._loading) {
				this._loading = false;
				this.seekTo(this._seekTime);
			}
		} else if (state === PlayerState.PAUSED) {
			this.trigger('pause');
		} else if (state === PlayerState.ENDED) {
			this.trigger('end');
		}
	};

	YoutubePlayer.prototype.onError = function (err) {
		console.error('youtube error : ' + err);
	};

	return YoutubePlayer;
});
