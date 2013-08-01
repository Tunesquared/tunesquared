'use strict';

var Framework = require('../framework');

var ObjectId = require('mongoose').Types.ObjectId;
var Party = require('../models/Party');

Framework.Controller({
	'playlistAddSongs': function(socket, data, ack){
		console.log('adding songs :');
		console.log(data.songs);
		var ids = [];
		var songs = data.songs;

		for(var i = 0 ; i < data.songs.length ; i++){
			ids.push(songs[i]._id = new ObjectId());
		}

		Party.update({_id: data.party}, { $pushAll: {playlist : data.songs}}, function (err) {
			ack(err, ids);
		});
	},

	'playlistRemoveSong': function(socket, data, ack){
		console.log('removing song from %s : ', data.party);
		console.log(data.song);
		Party.update({_id: data.party}, { $pull: {playlist : {id: data.song}}}, function (err) {
			ack(err);
		});
	}
});

new Framework.Router({
	'post:api/playlistAddSong': function(req, res){
		Party.findOne({_id: req.body.party}, function(err, mod){
			if (err) throw err;
			//TODO : handle error
			//TODO : this code is not crash-free

			if (mod == null){
				res.statusCode = 400;
				res.send('party not found');
				return;
			}

			mod.playlist.push(req.body.song);

			mod.save(function (err) {
				if (err) throw err;
				// TODO : handle error
				res.end();
			});
		});
	}
});
