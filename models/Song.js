'use strict';

var MAX_THUMB_URL_LENGTH = 128;

var mongoose = require('mongoose');

var validators = {
	'youtube': require('./validators/YoutubeValidator'),
	'fake': require('./validators/FakeValidator')
};

// List of valid sources, append here to accept new sources
var sources = ['youtube', 'fake'];

var Song = new mongoose.Schema({
		title: { type: String, required: true },
		artist: { type: String },
		source: { type: String, enum: sources, required: true},
		votes_yes: { type: Number, default: 0 },
		votes_no: { type: Number, default: 0 },
		thumb: { type: String },
		data: { type: String, required: true }
		/* nb : we can store actual song in a database and use some fancy analysis to match instances with these songs.
			then we connect this instance to the song with the attribute bellow allowing cool statistics. */
		// song : { type: Schema.Types.ObjectId, ref: 'Song' } // Link to the actual song
});

Song.path('thumb').validate(function(url) {
	return url.length < MAX_THUMB_URL_LENGTH;
});

// Forbidds insertion of a song with votes already present
Song.path('votes_yes').validate(function(votes) {
	return votes === 0;
});
Song.path('votes_no').validate(function(votes) {
	return votes === 0;
});

Song.path('data').validate(function(data, cb){
	var validator = validators[this.source], result;

	if (validator === undefined){
		cb(false);
		return;
	}

	// Allows validator to perform immediate validation.
	// If validation succeeds synchronously, it must return null
	// If validation is asynchronous, it must return null or undefined
	result = validator(data, cb);
	if(result != null) {
		cb(result);
	}
});

// Preformats fields before validation
Song.pre('validate', function (next) {
	if (this.title != null) this.title = this.title.substr(0, 32);
	this.artist = (this.artist != null) ? this.artist.substr(0, 32) : 'unknown';

	next();
});

module.exports = mongoose.model('song', Song);
