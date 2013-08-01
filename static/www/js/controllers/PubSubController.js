'use strict';

/*
	This controller takes a session and inspects it to make sure it is constantly synced with the server
*/
define(['underscore', 'socket', 'utils'], function (_, socket, utils) {

	var PubSubController = function (session) {

		_.bindAll(this, 'onChangeParty', 'onPlaylistAdd', 'onPlaylistRemove');

		this._session = session;

		session.on('change:party', this.onChangeParty);
		this.onChangeParty();
	};

	PubSubController.prototype.onChangeParty = function () {
		console.log('onChangeParty');
		this._party = this._session.get('party');

		if(this._party)
			this.watchPlaylist(this._party.get('playlist'));
	};

	PubSubController.prototype.watchPlaylist = function (playlist) {
		if(this._playlist){
			this._playlsit.off(null, null, this);
		}
		this._playlist = playlist;

		this._playlist.on('add', this.onPlaylistAdd);
		this._playlist.on('remove', this.onPlaylistRemove);
	};

	PubSubController.prototype.onPlaylistAdd = function (song) {
		socket.emit('playlistAddSongs', {
			party: this._party.id,
			songs: [song]
		}, function (err, id) {
			if (err) throw err;
			song.set('_id', id[0]);
		});
	};

	PubSubController.prototype.onPlaylistRemove = function (song) {
		socket.emit('playlistRemoveSongs', {
			party: this._party.id,
			songs: [song.id]
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
