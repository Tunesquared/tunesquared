'use strict';

var framework = require('../framework');

var Party = require('../models/Party');

/* TODO : modify RESTRouter's middleware api, see RESTRouter */

/* TODO : handle party delete */

var rest = new framework.RESTRouter(Party, 'api/party');

rest.before('create', function (req, data, cb){
	if(req.session.myParty != null){
		cb('already owns a party');
	} else {
		data.owner = req.session.publickey;
		cb(null, data);
	}
})
.after('create', function (req, data, cb) {
	req.session.myParty = data._id; // Owns this party
	req.session.partyId = data._id; // Is in this party
	req.session.save();
	cb(null, {_id: data._id});
})
.after('delete', function (req, data, cb){
	req.session.myParty = null;
	req.session.partyId = null;
	req.session.save(function (err) {
		console.log('destroyed');
		console.log(err);
		cb(err);
	});
});

rest.add({

	/* Voting methods : allows to vote for a song with id ":id" in the current party (you must be in a party) */
	'api/voteYesSong/:id': function(req, res){
		Party.voteYes(req.session.partyId, req.param('id'));
		res.end();
	},
	'api/voteNoSong/:id': function(req, res){
		Party.voteNo(req.session.partyId, req.param('id'));
		res.end();
	}
});


