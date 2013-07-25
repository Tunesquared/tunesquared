'use strict';
var mongoose = require('mongoose');
var validate = require('mongoose-validator').validate;

// maybe put this in some utils somewhere
function noop(){}

// List of valid sources, append here to accept new sources
var sources = ['youtube'];


var Song = new mongoose.Schema({
		title: { type: String },
		artist: { type: String },
		source: { type: String, enum: sources},
		votes_yes: { type: Number, default: 0 },
		votes_no: { type: Number, default: 0},
		data: String,
		/* nb : we can store actual song in a database and use some fancy analysis to match instances with these songs.
			then we connect this instance to the song with the attribute bellow allowing cool statistics. */
		// song : { type: Schema.Types.ObjectId, ref: 'Song' } // Link to the actual song
});

Song.pre('save', function (next) {
	if (this.title != null) this.title = this.title.substr(0, 32);
	if (this.artist != null) this.artist = this.artist.substr(0, 32);

	/* TODO : complex verification to check that data is accurate.
		This is shitty because each source have it's own way to check that */

		next();
});

var PartySchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true, validate: validate('len', 1, 32) },
	owner: { type: String, required: true, validate: validate('len', 36, 36) }, // Just a session publickey for now
	playlist: [Song]
});

/* Utilities method to vote without retreiving the model */

PartySchema.statics.voteYes = function (id, songId, cb) {
	this.update({_id: id, 'playlist._id': songId}, { $inc: { 'playlist.$.votes_yes': 1} }, cb || noop);
};
PartySchema.statics.voteNo = function (id, songId, cb) {
	this.update({_id: id, 'playlist._id': songId}, { $inc: { 'playlist.$.votes_no': 1} }, cb || noop);
};

module.exports = mongoose.model('party', PartySchema);
