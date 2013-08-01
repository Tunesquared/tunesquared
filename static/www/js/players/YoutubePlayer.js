'use strict';

define(['underscore', 'backbone', 'swfobject'], function (_, Backbone, swfobject) {

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
		// Saves a local copy of unique count and increments
		this._id = counter++;
		this._loadCb = ready;

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
		'seekChange'
		'volumeChange'
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

	YoutubePlayer.prototype.setVolume = function (vol) {
		this._player.setVolume(Math.floor(vol * 100));
	};

	// Seeks to time in msecs
	YoutubePlayer.prototype.seekTo = function (time) {
		this._player.seekTo(Math.floor(time / 1000), true);
	};

	// Getters :

	// Returns current time in msec
	YoutubePlayer.prototype.getSeekTime = function () {
		return this._player.getCurrentTime() * 1000;
	};

	YoutubePlayer.prototype.getDuration = function () {
		return this._player.getDuration() * 1000;
	};

	YoutubePlayer.prototype.release = function () {
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
