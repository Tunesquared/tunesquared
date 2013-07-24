'use strict';

define(['underscore', 'backbone', 'models/Song', 'socket'], function (_, Backbone, Song, socket) {

	var add = Backbone.Collection.prototype.add;

	var Playlist = Backbone.Collection.extend({
		model: Song,

		initialize: function (a, opts) {
			console.log(opts);
			if (opts == null || opts.party == null){
				throw 'One does not simply create a playlist without a party';
			}
			this.party = opts.party;
		},

		add: function (songs) {
			if(!_.isArray(songs)) songs = [songs];

			var args = arguments, self = this;
			socket.emit('playlistAddSongs', {party: this.party.id, songs: songs}, function () {
				add.apply(self, args);
			});
		}
	});

	return Playlist;
});
