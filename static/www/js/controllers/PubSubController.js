'use strict';

/*
	This controller takes a session and inspects it to make sure it is constantly synced with the server
*/
define(['underscore', 'socket', 'utils'], function (_, socket, utils) {

	var PubSubController = function (session) {

		_.bindAll(this, 'onChangeParty', 'onPlaylistAdd', 'onPlaylistRemove', 'onRemoteAddSongs');

		this._session = session;

		socket.on('playlistAddSongs', this.onRemoteAddSongs);

		session.on('change:party', this.onChangeParty);
		this.onChangeParty();
	};

	PubSubController.prototype.onChangeParty = function () {
		console.log('onChangeParty');

		var party = this._session.get('party');

		if (party) {
			if (this._party) {
				socket.emit('unsubscribeParty', this._party.id);
			}
			this._party = party;

			console.log('subscribing to : ' + this._party.id);
			socket.emit('subscribeParty', this._party.id);


			this.watchPlaylist(this._party.get('playlist'));
		}
	};

	PubSubController.prototype.watchPlaylist = function (playlist) {
		if (this._playlist) {
			this._playlsit.off(null, null, this);
		}
		this._playlist = playlist;

		this._playlist.on('add', this.onPlaylistAdd);
		this._playlist.on('remove', this.onPlaylistRemove);
	};

	PubSubController.prototype.onPlaylistAdd = function (song, coll, opts) {
		if (opts.remote) return;

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

	PubSubController.prototype.onRemoteAddSongs = function (data) {
		var partyId = data.partyId,
			songs = data.songs;

		if (this._party) {
			if (this._party.id == partyId) {
				this._playlist.add(songs, {
					remote: true
				});
			} else {
				console.error('Remote added song in the wrong party');
			}
		} else {
			console.error('Remote added song before I got a party');
		}
	};

	PubSubController.prototype.release = function () {
		this._session.off(null, null, this);
		this._playlist.off(null, null, this);

	};

	return PubSubController;
});
