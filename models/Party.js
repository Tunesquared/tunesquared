'use strict';
var mongoose = require('mongoose');
var validate = require('mongoose-validator').validate;

var Song = require('./Song').schema;

/* Validation config. Beware when modifing this, also change client files to keep UI consistent with validation */
/* Maximum string length for party title. (see client create dialog) */
var PARTY_TITLE_MAX_LEN = 32;

// A few constants needed in this file
function noop(){}
var ONE_DAY = 3600*24;


var PartySchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true, validate: validate('len', 1, PARTY_TITLE_MAX_LEN) },
	owner: { type: String, required: true, validate: validate('len', 36, 36) }, // Just a session publickey for now
  lastUse: { expires: ONE_DAY, type: Date, default: Date.now},
	playlist: [Song],
	currentSong: mongoose.SchemaTypes.ObjectId
});

PartySchema.pre('save', function(next) {
  this.name = this.name.toLowerCase();
  next();
});

/* Utilities method to vote */

PartySchema.statics.voteYes = function (id, songId, cb) {
	this.findOneAndUpdate({_id: id, 'playlist._id': songId}, {
    $inc: { 'playlist.$.votes_yes': 1},
    $set: { 'lastUse': Date.now(), 'playlist.$.lastVoteTS': Date.now() }
  }, cb || noop);
};

PartySchema.statics.voteNo = function (id, songId, cb) {
	this.findOneAndUpdate({_id: id, 'playlist._id': songId}, {
    $inc: { 'playlist.$.votes_no': 1},
    $set: { 'lastUse': Date.now(), 'playlist.$.lastVoteTS': Date.now() }
  }, cb || noop);
};

/* Changes a vote from 'yes to no' or 'no to yes'.
params:
  - id: Party id
  - songId: song id
  - val: 'yes_to_no' or 'no_to_yes'
*/
PartySchema.statics.changeVote = function(id, songId, val, cb) {
  if (val === 'yes_to_no') {
    this.findOneAndUpdate({_id: id, 'playlist._id': songId}, {
      $inc: { 'playlist.$.votes_no': 1, 'playlist.$.votes_yes': -1},
      $set: { 'lastUse': Date.now(), 'playlist.$.lastVoteTS': Date.now() }
    }, cb || noop);
  }
  else if (val === 'no_to_yes') {
    this.findOneAndUpdate({_id: id, 'playlist._id': songId}, {
      $inc: { 'playlist.$.votes_yes': 1, 'playlist.$.votes_no': -1},
      $set: { 'lastUse': Date.now(), 'playlist.$.lastVoteTS': Date.now() }
    }, cb || noop);
  }
  else {
    throw new Error('Cannot change vote with: ' + val);
  }
};

PartySchema.statics.addSongs = function(partyId, songs, cb) {
  this.findByIdAndUpdate(partyId, {
    $pushAll: {
      playlist: songs
    },

    $set: {
      lastUse: Date.now()
    }
  }, cb);
};


PartySchema.statics.mapVotes = function(data, votes) {
  var song;

  for(var i = 0 ; i < data.playlist.length ; i++) {
    song = data.playlist[i];
    if (song._id in votes) {
      song.vote = votes[song._id];
    }
  }

  return data;
};



module.exports = mongoose.model('party', PartySchema);
