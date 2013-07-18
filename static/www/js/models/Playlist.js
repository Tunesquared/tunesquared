'use strict';

define(['backbone', 'models/Song'], function (Backbone, Song) {
	var Playlist = Backbone.Collection.extend({
		model: Song
	});

	return Playlist;
});
