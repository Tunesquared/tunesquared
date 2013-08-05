'use strict';

var Framework = require('../framework');

var ObjectId = require('mongoose').Types.ObjectId;
var Party = require('../models/Party');
var Song = require('../models/Song');

Framework.Controller({
	'playlistAddSongs': function (socket, data, ack) {
		console.log('adding songs :');
		console.log(data.songs);
		var songs = [];

		for (var i = 0; i < data.songs.length; i++) {
			songs.push(new Song(data.songs[i]));
		}

		Party.findByIdAndUpdate(data.party, {
			$pushAll: {
				playlist: songs
			}
		}, function (err, party) {
			ack(err, songs);
		});
	},

	'playlistRemoveSongs': function (socket, data, ack) {
		console.log('removing song from %s : ', data.party);
		console.log(data.songs);
		Party.update({
			_id: data.party
		}, {
			$pull: {
				playlist: {
					_id: {
						$in: data.songs
					}
				}
			}
		}, function (err) {
			ack(err);
		});
	}
});

new Framework.Router({
	'post:api/playlistAddSong': function (req, res) {

		var song = new Song(req.body.song);

		Party.update(
			{
				_id: req.session.partyId
			}, {
				$pushAll: {
					playlist: [song]
				}
			}, function (err) {
				if(err) throw err;
				Framework.io.sockets.in('party' + req.session.partyId).emit('playlistAddSongs', {
					partyId: req.session.partyId,
					songs: [song]
				});
			});
		res.end();
	}
});
