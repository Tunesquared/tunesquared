'use strict';

var http = require('http');

var config = require('../../config');

var reqCache = new(require('node-request-caching'))({
	adapter: 'redis',
	options: {
		port: config.redis_port || 6379,
		host: config.redis_host || '127.0.0.1'
	}
});

var ONE_HOUR = 3600;

/*
	Validates data comming from youtube
*/
module.exports = function (data, cb) {
	if (data.length !== 11)
		return false;

	//*
	var req = reqCache.get(
		'http://gdata.youtube.com/feeds/api/videos/' + data,
		{},
		ONE_HOUR,
		function (err, res, body, cache) {
			cb(!err && res.statusCode === 200);
		});
	//*/


	/*
	var req = http.request({
	  hostname: 'gdata.youtube.com',
	  port: 80,
	  path: '/feeds/api/videos/' + data
	}, function(res) {
		console.log('has res');
		cb(res.statusCode === 200);
	});

	req.on('error', function(err){
		console.error(err);
		cb(false);
	});

	req.shouldKeepAlive = false;
	req.end();
	//*/
};
