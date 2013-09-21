'use strict';

/*
	Controls actions for party guests. Therefore, guests must be "in" the party
	to perform actions in this controller
*/

var framework = require('../framework');

var Party = require('../models/Party');
var Song = require('../models/Song');


new framework.Router({
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
				framework.io.sockets.in('party' + req.session.partyId).emit('playlistAddSongs', {
					partyId: req.session.partyId,
					songs: [song]
				});
			});
		res.end();
	},

	/* Voting methods : allows to vote for a song with id ":id" in the current party (you must be in a party) */
	'api/voteYesSong/:id': function(req, res){
		var songId = req.param('id');

		if (req.session['votes_' + songId] != null) {
			res.send(400, 'Already voted for that song.');
		} else {
			req.session['votes_' + songId] = true;
			req.session.save();
			Party.voteYes(req.session.partyId, songId, function (err, party) {
				if (!party) {
					req.session.reload(function(){
						delete req.session['votes_' + songId];
						req.session.save();
					});
					console.error('no party for the vote');
					return;
				}
				// Sends the whole song so that the party can more easily recover from errors.
				framework.io.sockets.in('party' + req.session.partyId).emit('playlistVoteSong', party.playlist.id(songId));
			});

			res.end();
		}
	},

	'api/voteNoSong/:id': function(req, res){
		var songId = req.param('id');

		if (req.session['votes_' + songId] != null) {
			res.send(400, 'Already voted for that song.');
		} else {
			req.session['votes_' + songId] = true;
			req.session.save();
			Party.voteNo(req.session.partyId, songId, function (err, party) {
				if (!party) {
					req.session.reload(function(){
						delete req.session['votes_' + songId];
						req.session.save();
					});
					console.error('no party for the vote');
					return;
				}
				// Sends the whole song so that the party can more easily recover from errors.
				framework.io.sockets.in('party' + req.session.partyId).emit('playlistVoteSong', party.playlist.id(songId));
			});
			res.end();
		}
	}
});
