'use strict';

define(['underscore', 'backbone', 'models/Song'], function (_, Backbone, Song) {

	var Playlist = Backbone.Collection.extend({
		model: Song
	});

	return Playlist;
});
