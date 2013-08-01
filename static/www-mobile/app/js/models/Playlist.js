'use strict';

define(['jquery', 'underscore', 'backbone', 'models/Song'], function($, _, Backbone, Song) {

	var add = Backbone.Collection.prototype.add;

	var Playlist = Backbone.Collection.extend({
		model: Song,

		add: function(song, callbacks) {
			// server ->
			if(callbacks && callbacks.silent){
				return add.apply(this, arguments);
			}

			callbacks = callbacks || {};
			var self = this;
			console.log(song);

			$.post('api/playlistAddSong', {
				song: song
			})
				.success(function() {
					add.call(self, song);
					if (callbacks.success) callbacks.success();
				})
				.error(function() {
					if (callbacks.error) callbacks.error();
				});
		}
	});

	return Playlist;
});
