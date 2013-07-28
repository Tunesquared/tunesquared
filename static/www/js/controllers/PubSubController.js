'use strict';

/*
	This controller takes a session and inspects it to make sure it is constantly synced with the server
*/
define(['underscore', 'socket'], function (_, socket) {

	var PubSubController = function (session) {

		_.bindAll(this, 'onChangeParty', 'onPlaylistAdd');

		this._session = session;

		session.on('change:party', this.onChangeParty);
	};

	PubSubController.prototype.onChangeParty = function () {
		console.log('onChangeParty');
		this._party = this._session.get('party');

		this.watchPlaylist(this._party.get('playlist'));
	};

	PubSubController.prototype.watchPlaylist = function (playlist) {
		this._playlist = playlist;

		this._playlist.on('add', this.onPlaylistAdd);
	};

	PubSubController.prototype.onPlaylistAdd = function (song) {
		socket.emit('playlistAddSongs', {
			party: this._party.id,
			songs: [song]
		}, function (err) {
			if (err) throw err;
		});
	};


	PubSubController.prototype.release = function () {
		this._session.off(null, null, this);
		this._playlist.off(null, null, this);

	};

	return PubSubController;
});
