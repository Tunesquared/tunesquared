'use strict';

var mongoose = require('mongoose');

// List of valid sources, append here to accept new sources
var sources = ['youtube', 'fake'];

var Song = new mongoose.Schema({
		title: { type: String, required: true },
		artist: { type: String },
		source: { type: String, enum: sources, required: true},
		votes_yes: { type: Number, default: 0 }, // TODO : find validator to forbid insertion
		votes_no: { type: Number, default: 0 }, //  TODO : same here
		thumb: { type: String },
		data: { type: String, required: true }
		/* nb : we can store actual song in a database and use some fancy analysis to match instances with these songs.
			then we connect this instance to the song with the attribute bellow allowing cool statistics. */
		// song : { type: Schema.Types.ObjectId, ref: 'Song' } // Link to the actual song
});

Song.pre('save', function (next) {
	if (this.title != null) this.title = this.title.substr(0, 32);
	if (this.artist != null) this.artist = this.artist.substr(0, 32);

	/* TODO : complex verification to check that data is accurate.
		This is shitty because each source has it's own way to check that */

		next();
});

module.exports = mongoose.model('song', Song);
