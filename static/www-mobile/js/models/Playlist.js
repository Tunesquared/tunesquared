'use strict';

define(['$', 'underscore', 'backbone', 'models/Song'], function($, _, Backbone, Song) {

	var add = Backbone.Collection.prototype.add;

	var Playlist = Backbone.Collection.extend({
		model: Song,

		// /!\ See desktop app comparator to be consistent
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

		add: function(song, callbacks) {
			// server ->
			if(callbacks && callbacks.silent){
				return add.apply(this, arguments);
			}

			song = (song instanceof Song) ? song.toJSON() : song;

			var args = arguments;

			callbacks = callbacks || {};
			var self = this;
			console.log(song);

			$.ajax({
				type: 'post',
				url: 'api/playlistAddSong',
				data: {
					song: song
				},
				success: function() {
					add.apply(self, args);
					if (callbacks.success) callbacks.success();
				},
				error: function() {
					if (callbacks.error) callbacks.error();
				}
			});
		}
	});

	return Playlist;
});
