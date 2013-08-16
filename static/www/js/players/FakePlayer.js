'use strict';

define(['underscore', 'backbone'], function (_, Backbone) {

	/**
		Creates a player for the given song attached to the givent html element
		*/

	function FakePlayer(song, element, ready) {

		setTimeout(function () {
			// Mandatory : must save the song as this.song !
			this.song = song;
			this.el = element;

			this._duration = pseudoRandom(song.get('data'), 30, 360) * 1000;
			this._interval = null;
			this._currentTime = 0;
			this._state = 'paused';

			ready(null, this);
		}.bind(this), 1);
	}

	/* Events :
		'play'
		'pause'
		'stop'
	*/
	_.extend(FakePlayer.prototype, Backbone.Events);

	/* This name must match the source name (in search) so that the factory
		knows which player to use for each song */
	FakePlayer.sourceName = 'fake';

	/* Returns a string with error explanation if there is a compatibility issue. */
	FakePlayer.checkCompatibility = function () {};

	// Controls :

	FakePlayer.prototype.play = function () {
		this._state = 'playing';
		if (this._interval == null) {
			this._interval = setInterval(this.updateTime.bind(this), 1000);
			this.trigger('play');
		}
	};

	FakePlayer.prototype.pause = function () {
		this._state = 'paused';
		if (this._interval) {
			clearInterval(this._interval);
			this._interval = null;
			this.trigger('pause');
		}
	};

	FakePlayer.prototype.stop = function () {
		this._state = 'paused';
		if (this._interval) {
			clearInterval(this._interval);
			this._interval = null;
			this.trigger('stop');
		}
		this._currentTime = 0;
	};

	// Volume 0 - 100
	FakePlayer.prototype.setVolume = function () {};

	// Seeks to time in msecs
	FakePlayer.prototype.seekTo = function (time) {
		this._currentTime = time;
	};

	// Getters :

	// Returns current time in msec
	FakePlayer.prototype.getSeekTime = function () {
		return this._currentTime;
	};

	FakePlayer.prototype.getDuration = function () {
		return this._duration;
	};

	FakePlayer.prototype.getProgress = function () {
		return this._currentTime / this._duration;
	};

	FakePlayer.prototype.getState = function () {
		return this._state;
	};

	FakePlayer.prototype.release = function () {
		this.off();
		this.pause(); // This will release the interval
	};



	// Implementation specific methods

	FakePlayer.prototype.updateTime = function () {
		this._currentTime += 1000;
		if (this._currentTime >= this._duration) {
			this._currentTime = this._duration;
			clearInterval(this._interval);
			this._interval = null;
			this.trigger('end');
		}
	};

	return FakePlayer;

	/* function to make it like it's random but have the same
	results accross multiple executions */

	function pseudoRandom(str, min, max) {
		min = min || 0;
		max = max || 10;
		var mod = max - min;
		var res = 0;
		for (var i = 0; i < str.length; i++) {
			res = (res + str.charCodeAt(i)) % mod;
		}
		return res + min;
	}
});
