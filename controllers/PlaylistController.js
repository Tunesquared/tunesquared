'use strict';

var Framework = require('../framework');

var Party = require('../models/Party');

Framework.Controller({
	'playlistAddSongs': function(socket, data, ack){
		Party.findOne({_id: data.party}, function(err, mod){
			if (err) throw err;
			//TODO : handle error
			//TODO : this code is not crash-free
			// TODO : handle permissions

			if (mod == null){
				ack('party not found');
				return;
			}

			var songs = data.songs;

			console.log(songs);
			for(var i = 0 ; i < songs.length ; i++){
				console.log('adding : '+JSON.stringify(songs[i]));
				mod.playlist.push(songs[i]);
			}

			mod.save(function (err) {
				if (err) throw err;
				// TODO : handle error
				ack();
			});
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
