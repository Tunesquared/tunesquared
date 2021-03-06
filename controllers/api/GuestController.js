'use strict';

/*
	Controls actions for party guests. Therefore, guests must be "in" the party
	to perform actions in this controller
*/

var framework = require('../../framework');

var Party = require('../../models/Party');
var Song = require('../../models/Song');


function returnError(res) {
	res.statusCode = 500;
	res.end();
}

new framework.Router({

	/* Direct access to a party */
	'party/:name': function (req, res) {
		Party.findOne({
      name: req.param('name').toLowerCase()
    }, function (err, mod) {

      if (err) {
        res.send('{"error": "' + err + '"}');
      } else if (mod === null) {
        res.render('partyNotFound', {name: req.param('name')});
      } else {

        req.session.partyId = mod._id;

        req.session.save(function () {
          res.redirect('/m');
        });
      }
    });
	},

	'post:api/playlistAddSong': function (req, res) {
		var song = new Song(req.body.song);

		// Todo: put these two lines in model instead of here
		song.votes_yes = 1;
		song.lastVoteTS = Date.now();

		req.session.votes[song._id] = 'yes';

		// Notice: seems like a perfect place to use futures
		req.session.save(function(err){
			if (err) {
				console.error(err);
				return returnError(res);
			}
			song.save(function(err){
				if (err) {
					console.error(err);
					return returnError(res);
				}
				Party.addSongs(req.session.partyId, [song], function (err) {
					if(err) {
						console.error(err);
						return returnError(res);
					};
					framework.io.sockets.in('party' + req.session.partyId).emit('playlistAddSongs', {
						partyId: req.session.partyId,
						songs: [song]
					});
					res.end();
				});
			});
		});

	},

	/* Voting methods : allows to vote for a song with id ":id" in the current party (you must be in a party) */
	'api/voteYesSong/:id': function(req, res){
		var songId = req.param('id');

		if (req.session.votes[songId] === 'yes') {
			res.send(400, 'Already voted for that song.');
		} else if (req.session.votes[songId] === 'no') {
			req.session.votes[songId] = 'yes';
			req.session.save();
			Party.changeVote(req.session.partyId, songId, 'no_to_yes', function (err, party) {
				if (!party) {
					req.session.reload(function(){
						delete req.session.votes[songId];
						req.session.save();
					});
					console.error('no party for the vote');
					return;
				}
				// Sends the whole song so that the party can more easily recover from errors.
				framework.io.sockets.in('party' + req.session.partyId).emit('playlistVoteSong', party.playlist.id(songId));
			});
			res.end();
		} else {
			req.session.votes[songId] = 'yes';
			req.session.save();
			Party.voteYes(req.session.partyId, songId, function (err, party) {
				if (!party) {
					req.session.reload(function(){
						delete req.session.votes[songId];
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

		if (req.session.votes[songId] === 'no') {
			res.send(400, 'Already voted for that song.');
		} else if (req.session.votes[songId] === 'yes') {
			req.session.votes[songId] = 'no';
			req.session.save();
			Party.changeVote(req.session.partyId, songId, 'yes_to_no', function (err, party) {
				if (!party) {
					req.session.reload(function(){
						delete req.session.votes[songId];
						req.session.save();
					});
					console.error('no party for the vote');
					return;
				}
				// Sends the whole song so that the party can more easily recover from errors.
				framework.io.sockets.in('party' + req.session.partyId).emit('playlistVoteSong', party.playlist.id(songId));
			});
			res.end();
		} else {
			req.session.votes[songId] = 'no';
			req.session.save();
			Party.voteNo(req.session.partyId, songId, function (err, party) {
				if (!party) {
					req.session.reload(function(){
						delete req.session.votes[songId];
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
