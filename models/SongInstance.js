'use strict';

var Model = require('../framework').Model;

/* jshint unused: false */
/**
	Instance of a song currently used in a party
*/
var SongInstance = module.exports = Model('song', {
	name: String,
	votes: Number,
	creator: String
});
