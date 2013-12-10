'use strict';
/*
	PlayerFactory.js
	API for instanciating players and checking compatibility.

	Any operation on players should start from here. Call create() to create a
	new player instance. This method takes care of instanciating the right kind
	of player and returns an instance of Player. All players implement the same
	API so they can be used in a transparent fashion.
*/
define([
/*
	Require all exposed players
*/
	'players/YoutubePlayer',
	'players/FakePlayer'
], function (
	YoutubePlayer,
	FakePlayer
) {

	/*
		To add players, simply add them here.
	*/
	var players = {};
	players[YoutubePlayer.sourceName] = YoutubePlayer;
	players[FakePlayer.sourceName] = FakePlayer;

	var PlayerFactory = {

		/*
			Returns a list of compatibility errors or false if no error was found.
			The list is of type:
			[
				{
					type: String, source that caused the problem
					err: String, error string describing the problem
				}
			]
		*/
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

		/*
			Creates a new song player.
			Arguments:
			- song [Song]: target for which to create a player
			- el [DOM element]: element to attach visualisation
			- cb: callback that get passed (error, player[, data]) when the player is ready.
			- data: additionnal data passed to the callback
		*/
		create: function (song, el, cb, data) {
			var source = song.get('source');
			console.log('factory creating a song of type ' + source);

			var Player = players[source];
			if (Player == null) {
				cb('Oh lala, no player of type : ' + source);
				return;
			}

			var player = new Player(song, el, function(err) {
				cb(err, player, data);
			});

		}
	};

	return PlayerFactory;
});
