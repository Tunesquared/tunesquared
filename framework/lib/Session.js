'use strict';

var guid = require('./utils').guid;

// Middleware to make sure session is well populated
module.exports = function(req, res, next){
	var sess = req.session;
	if (!sess.publickey) {
      sess.publickey = guid();
      sess.save(next);
  } else {
      next();
  }
};
