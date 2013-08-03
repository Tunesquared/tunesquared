'use strict';

var Framework = require('../framework');

var ObjectId = require('mongoose').Types.ObjectId;
var Party = require('../models/Party');

Framework.Controller({
	'playlistAddSongs': function (socket, data, ack) {
		console.log('adding songs :');
		console.log(data.songs);
		var ids = [];
		var songs = data.songs;

		for (var i = 0; i < data.songs.length; i++) {
			ids.push(songs[i]._id = new ObjectId());
		}

		Party.update({
			_id: data.party
		}, {
			$pushAll: {
				playlist: data.songs
			}
		}, function (err) {
			ack(err, ids);
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

		var song = req.body.song;

		Party.findOne({
			_id: req.session.partyId
		}, function (err, mod) {
			if (err) throw err;
			//TODO : handle error
			//TODO : this code is not crash-free

			if (mod == null) {
				res.statusCode = 400;
				res.send('party not found');
				return;
			}

			mod.playlist.push(song);

			mod.save(function (err) {
				if (err) throw err;

				Framework.io.sockets. in ('party' + req.session.partyId).emit('playlistAddSongs', {
					partyId: req.session.partyId,
					songs: [song]
				});
				// TODO : handle error
				res.end();
			});
		});
	}
});
