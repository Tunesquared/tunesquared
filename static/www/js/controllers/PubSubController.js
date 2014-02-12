'use strict';

/*
	This controller takes a session and inspects it to make sure it is constantly synced with the server
*/
define(['underscore', 'socket', 'utils'], function (_, socket, utils) {

	var PubSubController = function (session) {

		_.bindAll(this, 'onChangeParty', 'onPlaylistAdd', 'onPlaylistRemove', 'onRemoteAddSongs', 'onRemoteVoteSong', 'onPlaylistAddMany');

		this._session = session;

		socket.on('playlistAddSongs', this.onRemoteAddSongs);
		socket.on('playlistVoteSong', this.onRemoteVoteSong);

		session.on('change:party', this.onChangeParty);
		this.onChangeParty();
	};

	PubSubController.prototype.onChangeParty = function () {
		var party = this._session.get('party');

		if (party) {
			if (this._party) {
				socket.emit('unsubscribeParty', this._party.id);
				party.off('change:currentSong', this.onCurrentSongChange);
			}
			this._party = party;
			party.on('change:currentSong', this.onCurrentSongChange);

			socket.emit('subscribeToParty', this._party.id);


			this.watchPlaylist(this._party.get('playlist'));
		}
	};

	PubSubController.prototype.watchPlaylist = function (playlist) {
		if (this._playlist) {
			this._playlsit.off(null, null, this);
		}
		this._playlist = playlist;

		this._playlist.on('add', this.onPlaylistAdd);
		this._playlist.on('addMany', this.onPlaylistAddMany);
		this._playlist.on('remove', this.onPlaylistRemove);
	};

	PubSubController.prototype.onCurrentSongChange = function (party, song) {
		console.log('current song changed');

		if(song == null || song.id != null){
			proceed();
		} else {
			song.on('change:_id', proceed);
		}

		function proceed(){
			socket.emit('partySetCurrentSong', {
				song: (song && song.id) || null,
				party: party.id
			}, function (err) {
				if (err) throw err;
			});
		}
	};

	PubSubController.prototype.onPlaylistAdd = function (song, coll, opts) {
		if (opts.remote) return;

		socket.emit('playlistAddSongs', {
			party: this._party.id,
			songs: [song]
		}, function (err, data) {
			if (err) throw err;
			song.set(data[0]);
		});
	};

	PubSubController.prototype.onPlaylistAddMany = function (songs, coll) {
		socket.emit('playlistAddSongs', {
			party: this._party.id,
			songs: songs
		}, function (err, data) {
			if (err) throw err;
			coll.set(data);
		});
	};

	PubSubController.prototype.onPlaylistRemove = function (song, coll, opts) {
		if (opts.remote) return;

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

	PubSubController.prototype.onRemoteVoteSong = function (data) {
		console.log('on vote');
		console.log(data);

		this._playlist.set([data], {remote: true, remove: false});
		this._playlist.sort();
	};

	PubSubController.prototype.release = function () {
		this._session.off(null, null, this);
		this._playlist.off(null, null, this);

	};

	return PubSubController;
});
