'use strict';
var mongoose = require('mongoose');
var validate = require('mongoose-validator').validate;

var Song = require('./Song').schema;

/* Validation config. Beware when modifing this, also change client files to keep UI consistent with validation */
/* Maximum string length for party title. (see client create dialog) */
var PARTY_TITLE_MAX_LEN = 32;

// maybe put this in some utils somewhere
function noop(){}


var PartySchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true, validate: validate('len', 1, PARTY_TITLE_MAX_LEN) },
	owner: { type: String, required: true, validate: validate('len', 36, 36) }, // Just a session publickey for now
	playlist: [Song]
});

/* Utilities method to vote without retreiving the model */

PartySchema.statics.voteYes = function (id, songId, cb) {
	this.findOneAndUpdate({_id: id, 'playlist._id': songId}, { $inc: { 'playlist.$.votes_yes': 1} }, cb || noop);
};
PartySchema.statics.voteNo = function (id, songId, cb) {
	this.findOneAndUpdate({_id: id, 'playlist._id': songId}, { $inc: { 'playlist.$.votes_no': 1} }, cb || noop);
};

module.exports = mongoose.model('party', PartySchema);
