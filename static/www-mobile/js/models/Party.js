'use strict';
// Party Model
// ==============

// Includes file dependencies
define(['$', 'backbone', 'underscore', 'models/Playlist'], function ($, Backbone, _, Playlist) {

  // The Party constructor
  var Party = Backbone.Model.extend({
    urlRoot: 'api/party',
    idAttribute: '_id',
    defaults: {
      name: ''
    },

    initialize: function () {
      _.bindAll(this, 'fetch');

      if (!(this.get('playlist') instanceof Playlist)) {
        this.set('playlist', new Playlist(this.get('playlist')));
      }

      var playlist = this.get('playlist');
      if(typeof this.get('currentSong') === 'string') {
        this.set('currentSong', playlist.get(this.get('currentSong')));
        playlist.remove(this.get('currentSong'));
      }
    },

    isCurrent: function (song) {
      return song.id === this.get('currentSong').id;
    },

    parse: function (attr) {
      if (attr.playlist) {
        var playlist = this.get('playlist') || new Playlist([]);
        playlist.reset(attr.playlist);
        attr.playlist = playlist;

        attr.currentSong = playlist.get(attr.currentSong);
        playlist.remove(attr.currentSong);
      }
      return attr;
    }
  });


  //static
  Party.getByName = function (name, callback) {
    console.log('getByName');
    // Fetches party id from it's name
    $.getJSON('api/getPartyByName/' + encodeURIComponent(name))

    // In case of ajax success :
    .success($.proxy(function (data) {

      // The server may still have encountered an internal error (typically "no party with such name")
      if (data.error) {
        callback(null);
      }
      // Otherwise, we can process the model
      else {
        var party = new Party(data);
        callback(party);
      }
    }, this))

    // In case of error :
    .error(function () {
      callback(null);
    });
  };

  // Returns the Party class
  return Party;

});
