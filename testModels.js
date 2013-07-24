'use strict';

var db = require('./framework/lib/db');

db.connect(function(db){
	var Party = require('./models/Party');
	var RESTRouter = require('./framework/lib/RESTRouter');

	/*
	Party.findOne({'owner': 'me'}, function(err, mod){
		if(err) throw err;
		mod.playlist.push({
			title: 'testsong',
			artist: 'the testers',
			source: 'youteub',
			data: 'hqhq'
		});
		mod.save(end);
	});
	*/
	/*
	Party.voteYes('51f03c15faa67f2805000002', '51f03efec27e31980f000002', end);
	Party.voteNo('51f03c15faa67f2805000002', '51f03efec27e31980f000002', end);

	function end(err) {
		console.log('done');
		if (err) throw err;
		db.close();
	}*/

});
