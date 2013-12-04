'use strict';


/*
	Youtube player wrapper.
*/

define(['underscore', 'players/LayoutManager', 'players/Player'],
	function (_, LayoutManager, Player) {

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


	// hash of player instances waiting for their beloved YT player.
	var loadingPlayers = {};

	/**
		--- Constructor ---
	*/
	function YoutubePlayer(song, element, ready) {
		Player.apply(this, arguments);
		/*
			We want the attributes to be modified when resizing, not the css. This is
			because we create an "object" DOM node which takes "width" and "height"
			attributes. For normal DOM nodes, we would use css's "height" and "width".
		*/
		this.layout = {
			resizeMethod: 'attr'
		};


		// Saves a local copy of unique count and increments
		this._id = counter++;
		// Saves the ready callback for later use
		this._loadCb = ready;

		/* We keep our own seekTime because youtube player resets it's own seek time
			on start. This variable allows us to keep state consistent during this phase
			(see Player.seekTo)
		*/
		this._seekTime = 0;

		// Remembers wether player has already played once (fixes some seek time issues)
		this._hasFirstPlay = false;

		// Creates a target for flash loading
		var target = document.createElement('div');
		target.id = 'youtube_host' + counter;
		element.appendChild(target);

		// Registers this in the array of players waiting for flash load.
		loadingPlayers[this._id] = this;

		// -------------------------------------------------------------------

		// 3. This function creates an <iframe> (and YouTube player)
		//		after the API code downloads.

		function onYouTubeIframeAPIReady() {
			var player;
			player = new YT.Player(target.id, {
				height: '200',
				width: '200',
				videoId: this._id,
				playerVars: { 'autoplay': 1, 'controls': 0 },
				events: {
				}
			});
		}
		/*
		// Creates a target for flash loading
		var target = document.createElement('div');
		target.id = 'youtube_host' + counter;
		element.appendChild(target);

		// Registers this in the array of players waiting for flash load.
		loadingPlayers[this._id] = this;

		// Embeds flash object. See 'onYoutubePlayerReady' for more action!
		swfobject.embedSWF(
			'//www.youtube.com/apiplayer?enablejsapi=1&version=3&playerapiid=' + this._id,
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
		*/
	}

	_.extend(YoutubePlayer.prototype, Player.prototype);
	_.extend(YoutubePlayer, Player);

	/* This name must match the source name (in search) so that the factory
		knows which player to use for each song */
	YoutubePlayer.sourceName = 'youtube';

	/* Returns a string with error explanation if there is a compatibility issue. */
	YoutubePlayer.checkCompatibility = function () {
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
		if (this._hasFirstPlay === false){
			this._seekTime = time;
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
		freeYTCallback(this, 'onStateChange');
		freeYTCallback(this, 'onError');
	};



	// Implementation specific methods

	/*
		Callback invoked right after the embedded player has been embedded.
		Instruments the player, loads the song and tells upper layer that we are ready.
	*/
	YoutubePlayer.prototype.onLoad = function (ytPlayer) {
		this._player = ytPlayer;

		this._player.addEventListener('onStateChange', makeYTCallback(this, 'onStateChange'));
		this._player.addEventListener('onError', makeYTCallback(this, 'onError'));
		this._loadCb(null, this);

		ytPlayer.loadVideoById(this.song.get('data'), 0, 'large');

		// At this point, the whole process of instanciating a player is over.
	};

	/*
		Messages from the youtube player to the app.
	*/
	YoutubePlayer.prototype.onStateChange = function (state) {
		console.log('state change : ' + state);
		if (state === PlayerState.PLAYING) {
			this.trigger('play');

			// Fixes the seekTo issue
			if (this._hasFirstPlay === false) {
				this._hasFirstPlay = true;
				this.seekTo(this._seekTime);
			}

		} else if (state === PlayerState.PAUSED) {
			this.trigger('pause');
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


	/*
		This callback is invoked when youtube finishes embedding a player. We can then
		get control back and associate the YT player with the right Player.
	*/
	makeYTCallback('onYouTubePlayerReady', function (playerId) {
		var ytplayer = document.getElementById('ytplayer_' + playerId);
		if (ytplayer == null){
			throw new Error('Invalid yt player id:' + playerId);
		}

		// Gets the instance of player waiting for this youtube.
		var player = loadingPlayers[playerId];

		if (player == null) {
			ytplayer.parentNode.removeChild(ytplayer);
		} else {
			player.onLoad(ytplayer);
			delete loadingPlayers[playerId];
		}
	});


	/*
		Since addEventListener expects a string, we need to register callbacks in
		global namespace. Moreover, when stack is started by flash, errors fail silently !

		This awesome utility that allows us to register some callbacks in global space
		while handling silent errors.

		usage:
			- makeYTCallback(player, callbackName): returns a string pointing to the mapped
				player[callbackName] callback. player must be instance of Player
			- makeYTCallback(name, callback): Mapps the provided callback with "name"
				directly to window[name] with some error handling.
	*/
	function makeYTCallback(ctx, fn) {
		var cbName, callback, context;

		if (typeof fn === 'string') {
			cbName = 'yt_'+ctx._id+fn;
			callback = ctx[fn];
			context = ctx;
		} else {
			cbName = ctx;
			callback = fn;
		}

		window[cbName] = function () {
			try {
				callback.apply(ctx, arguments);
			} catch (e) {
				console.error({msg: e.message, stk: e.stack.split('\n')});
			}
		};
		return cbName;
	}


	/*
		This method needs to be called to clean a youtube callback. Only for callbacks
		registered with makeYTCallback(player, callbackName)
	*/
	function freeYTCallback(ctx, name) {
		delete window['yt_'+ctx._id+name];
	}

	return YoutubePlayer;
});

