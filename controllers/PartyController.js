'use strict';

var RESTRouter = require('../framework').RESTRouter;

var Party = require('../models/Party');

/* TODO : modify RESTRouter's middleware api, see RESTRouter */

RESTRouter(Party, 'api/party', {
	before: function (req, method, data, cb){
		if (method === 'create') {
			data.owner = req.session.publickey;
			cb(null, data);
		} else {
			RESTRouter.defaultBefore(req, method, data, cb);
		}
	},

	after: function (req, method, data, cb) {
		if(method === 'create'){
			req.session.partyId = data._id;
			req.session.save();
			cb(null, data);
		} else {
			RESTRouter.defaultAfter(req, method, data, cb);
		}
	}
});
