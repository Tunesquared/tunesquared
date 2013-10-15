'use strict';

define(['$', 'underscore', 'backbone', 'models/Song'], function($, _, Backbone, Song) {

	var add = Backbone.Collection.prototype.add;

	var Playlist = Backbone.Collection.extend({
		model: Song,

		// /!\ See desktop app comparator to be consistent
		comparator: function (song) {
			// Songs are sorted in reverse-order : lower is better

			// Sorts by absolute vote value
			return song.get('votes_no') - song.get('votes_yes') +

			// Plus a little bonus to solve ties (more yes is absolutely better)
			(1/(song.get('votes_yes')+1));
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
