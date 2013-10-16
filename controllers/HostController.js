'use strict';

/*
	Controls and exposes actions for the party's host. This means user must
	own the party to perform any action via this controller
*/


var framework = require('../framework');
var Party = require('../models/Party');
var Song = require('../models/Song');

framework.Controller({

	/*
		Adds a set of songs to the playlist
		expects :
			- data.songs : array of valid songs
			- data.party : id of the party on which to perform action
										this must match session's myParty
		authorization : user must own the party
	*/
	'playlistAddSongs': function (socket, data, ack) {
		// Checking data presence
		if (data.songs == null || data.party == null) {
			ack('bad data');
			return;
		}

		socket.session(function (session) {
			var song,
				inputSongs,
				modelSongs = [],
				songCount,
				validated = 0,
				errors = [];

			// Authorization :
			if (data.party !== session.myParty) {
				ack('party is not yours');
				return;
			}
			// we do not check against party.owner since session.myParty is sufficient

			// Preprocess data
			inputSongs = data.songs;
			if (!Array.isArray(inputSongs)) {
				inputSongs = [data.songs];
			}
			songCount = inputSongs.length;

			// Validation
			for (var i = 0; i < songCount; i++) {
				song = new Song(inputSongs[i]);
				modelSongs.push(song);
				song.validate(onValidate);
			}

			// continues only when all validations are successful
			function onValidate(err) {
				if (err) {
					errors.push(err);
				}
				if (++validated === songCount) {
					if (errors.length !== 0){
						ack(errors);
					} else {
						performUpdate();
					}
				}
			}

			// Actual action on the model
			function performUpdate() {
				Party.findByIdAndUpdate(data.party, {
					$pushAll: {
						playlist: modelSongs
					}
				}, function (err) {
					ack(err, modelSongs);
				});
			}
		});
	},

	/*
		Removes a set of songs from the playlist
		expects:
			- data.songs : array of valid song ids
			- data.party : id of the party on which to perform action
										this must match session's myParty
		authorization : user must own the party
	*/
	'playlistRemoveSongs': function (socket, data, ack) {
		var songs;

		// Checking data presence
		if (data.songs == null || data.party == null) {
			ack('bad data');
			return;
		}

		socket.session(function (session) {

			// Authorization :
			if (data.party !== session.myParty) {
				ack('user is not host');
				return;
			}
			// we do not check against party.owner since session.myParty is sufficient

			// Preprocess data
			songs = data.songs;
			if (!Array.isArray(songs)) {
				songs = [data.songs];
			}

			Party.update({
				_id: data.party
			}, {
				$pull: {
					playlist: {
						_id: {
							$in: songs
						}
					}
				}
			}, function (err) {
				ack(err);
			});
		});
	},

	/*
		Sets current song of the party
		expects:
			- data.song: valid song id,
			- data.party: valid party id the user owns
		authorization: user must own the party
	*/
	'partySetCurrentSong': function (socket, data, ack) {

		// Checking data presences
		if (data.song === undefined || data.party == null) {
			ack('bad data');
		}

		socket.session(function (session) {
			var song = data.song;

			// Authorization :
			if (data.party !== session.myParty) {
				ack('user is not host');
				return;
			}
			// we do not check against party.owner since session.myParty is sufficient

			if (song != null) {
				Party.findById(data.party, function(err, party){
					if (err || party == null || party.playlist.id(song) == null) {
						ack (err);
						return;
					}

					performAction();
				});
			} else {
				performAction();
			}

			function performAction() {
				// action
				Party.update({
					_id: data.party
				}, {
					currentSong: data.song
				}, function (err) {
					ack(err);
				});
			}
		});
	},

	/*
		Subscribes a socket to a party channel
		This channel carries any action mutating party's state
		expects:
			- data : a valid party id
		authorization : anyone who's in the party
	*/
	'subscribeToParty': function (sock, data, ack) {
		if (!ack) ack = function(){};

		sock.session(function (session) {

			// Authorization
			if (session.partyId !== data) {
				ack('must join the party before subscribing');
				return;
			}

			// Verification
			Party.findById(data, function (err, party) {

				if (err || party == null) {
					ack(err || 'invalid party id');
				}

				console.log('subscribing to ' + data);
				sock.join('party' + data);
			});
		});
	},

	/*
		Unsubscribes a socket from a party channel
		expects:
			- data to be a party id
		authorization: nothing
	*/
	'unsubscribeFromParty': function (sock, data /*, ack*/ ) {
		console.log('unsubscribing to ' + data);
		sock.leave('party' + data);
	}
});

/* We create the rest router here. Although "read" is a public action on the party model,
	most actions concerns the host */
var rest = new framework.RESTRouter(Party, 'api/party');

rest
/*
		expects the user not to be in a party already
		completes party's "owner" field
	*/
.before('create', function (req, data, cb) {
	if (req.session.myParty != null) {
		cb('already owns a party');
	} else {
		data.owner = req.session.publickey;
		cb(null, data);
	}
})

/* assign party and party ownership to session */
.after('create', function (req, data, cb) {
	req.session.myParty = data._id; // Owns this party
	req.session.partyId = data._id; // Is in this party
	req.session.save();
	cb(null, {
		_id: data._id
	});
})

/* expects user to own the party */
.before('delete', function (req, id, cb) {
	if (id !== req.session.myParty) {
		cb('user is not host');
		return;
	}
	cb(null, id);
})

/* Unassign party and party ownership to user */
.after('delete', function (req, data, cb) {
	req.session.myParty = null;
	req.session.partyId = null;
	req.session.save(function (err) {
		cb(err);
	});
})

/* update via REST api not supported */
.before('update', function (req, data, cb) {
	cb('action not allowed');
})

/* expects user to be in party before reading it */
.before('read', function (req, id, cb) {
	if (id !== req.session.partyId) {
		cb('must join the party before reading it');
		return;
	}
	cb(null, id);
})

.after('read', function (req, data, cb) {
  cb(null, Party.mapVotes((data != null) ? data.toObject() : data, req.session.votes));
});
