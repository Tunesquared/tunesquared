'use strict';

var framework = require('../framework');

var Party = require('../models/Party');

/* TODO : modify RESTRouter's middleware api, see RESTRouter */

framework.RESTRouter(Party, 'api/party', {
	before: function (req, method, data, cb){
		if (method === 'create') {
			data.owner = req.session.publickey;
			cb(null, {_id: data._id});
		} else {
			framework.RESTRouter.defaultBefore(req, method, data, cb);
		}
	},

	after: function (req, method, data, cb) {
		if(method === 'create'){
			req.session.partyId = data._id;
			req.session.save();
			cb(null, data);
		} else {
			framework.RESTRouter.defaultAfter(req, method, data, cb);
		}
	}
});

framework.Router({

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


