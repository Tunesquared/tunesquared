'use strict';

var RESTRouter = require('../framework').RESTRouter;

var Party = require('../models/Party');


RESTRouter(Party, 'api/party', {
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
