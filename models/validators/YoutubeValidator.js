'use strict';

var http = require('http');
/*
	Validates data comming from youtube
*/
module.exports = function(data, cb) {
	if(data.length !== 11)
		return false;

	console.log('verifying');

	var req = http.request({
	  hostname: 'gdata.youtube.com',
	  port: 80,
	  path: '/feeds/api/videos/' + data
	}, function(res) {
		console.log('has res');
		cb(res.statusCode === 200);
	});

	req.on('error', function(err){
		console.log(err);
	});

	req.end();
};
