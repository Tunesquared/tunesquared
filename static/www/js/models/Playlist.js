'use strict';

define(['underscore', 'backbone', 'models/Song'], function (_, Backbone, Song) {

	var Playlist = Backbone.Collection.extend({
		model: Song,

		// Report any change to mobile version
		comparator: function (song) {
			// Songs are sorted in reverse-order : lower is better

			// Sorts by absolute vote value
			return song.get('votes_no') - song.get('votes_yes') +

			// Plus a little bonus to solve ties (more yes is absolutely better)
			(1/(song.get('votes_yes')+1));
		}
	});

	return Playlist;
});
