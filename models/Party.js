'use strict';

// maybe put this in some utils somewhere
function noop(){}

var mongoose = require('mongoose');

var PartySchema = new mongoose.Schema({
	name: { type: String, unique: true},
	owner: String, // Just a session publickey for now
	playlist: [{
		title: String,
		artist: String,
		source: String,
		votes_yes: { type: Number, default: 0 },
		votes_no: { type: Number, default: 0},
		data: String
		/* Todo : we can store actual song in a database and use some fancy analysis to match instances with these songs.
			then we connect this instance to the song with the attribute bellow allowing cool statistics. */
		// song : { type: Schema.Types.ObjectId, ref: 'Song' } // Link to the actual song
	}]
});

/* Utilities method to vote without retreiving the model */

PartySchema.statics.voteYes = function (id, songId, cb) {
	this.update({_id: id, 'playlist._id': songId}, { $inc: { 'playlist.$.votes_yes': 1} }, cb || noop);
};
PartySchema.statics.voteNo = function (id, songId, cb) {
	this.update({_id: id, 'playlist._id': songId}, { $inc: { 'playlist.$.votes_no': 1} }, cb || noop);
};

module.exports = mongoose.model('party', PartySchema);
