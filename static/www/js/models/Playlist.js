'use strict';

define(['underscore', 'backbone', 'models/Song'], function (_, Backbone, Song) {

	var Playlist = Backbone.Collection.extend({
		model: Song,

		// Report any change to mobile version
		comparator: function (s1, s2) {
			// Songs are sorted in reverse-order : lower is better

			var score1 = s1.attributes.votes_yes - s1.attributes.votes_no;
			var score2 = s2.attributes.votes_yes - s2.attributes.votes_no;
			// Sorts by absolute vote value
			return (score1 > score2 ||
				score1 === score2 &&
					(s1.attributes.votes_no < s2.attributes.votes_no ||
					s1.attributes.votes_no === s2.attributes.votes_no &&
						s1.attributes.lastVoteTS < s2.attributes.lastVoteTS)) ? -1 : 1;
		},

		addMany: function(songs) {
			// this.add(songs, {silent: true}); Doesn't actually adds them and hopes a controller will do so.
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
