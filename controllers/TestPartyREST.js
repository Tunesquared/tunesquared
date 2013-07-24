var RESTRouter = require('../framework').RESTRouter;

var Party = require('../models/Party');

RESTRouter(Party, 'api/party');
