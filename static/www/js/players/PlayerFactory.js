'use strict';
/*
	Exposes methods to create players and to detect browser compatibility
	*/
define(['players/YoutubePlayer'], function (YoutubePlayer) {

	var players = {};
	players[YoutubePlayer.sourceName] = YoutubePlayer;

	var PlayerFactory = {

		checkCompatibility: function () {
			var errStr;
			var errors = [];
			for (var i in players) {
				errStr = players[i].checkCompatibility();
				if (typeof errStr === 'string') {
					errors.push({
						type: i,
						err: errStr
					});
				}
			}

			return (errors.length > 0) ? errors : false;
		},

		create: function (song, el, cb) {
			var source = song.get('source');
			console.log('factory creating a song of type ' + source);

			var Player = players[source];
			if (Player == null) {
				cb('Oh lala, no player of type : ' + source);
				return;
			}

			new Player(song, el, cb);

		}
	};

	return PlayerFactory;
});
