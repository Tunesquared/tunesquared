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
		},

		addMany: function(songs) {
			this.add(songs, {silent: true});
			this.trigger('addMany', songs, this)
		},

		filterCurrentSong: function(song) {
			this.models = _.filter(this.models, function(m) {
				return m.id !== song.id;
			});

			this.trigger('change');
		}
	});

	return Playlist;
});
