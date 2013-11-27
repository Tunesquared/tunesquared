'use strict';
// Party Model
// ==============

// Includes file dependencies
define(['jquery', 'underscore', 'backbone', 'models/Playlist', 'models/Song'], function($, _, Backbone, Playlist, Song) {

  // The Model constructor
  var Model = Backbone.Model.extend({
    urlRoot: 'api/party',
    idAttribute: '_id',
    defaults: {
      name: ''
    },

    initialize: function() {
      _.bindAll(this, 'isCurrent');

      if (!(this.get('playlist') instanceof Playlist)) {
        this.set('playlist', new Playlist(this.get('playlist')));
      }

      if (!(this.get('currentSong') instanceof Song)) {
        this.set('currentSong', this.get('playlist').get(this.get('currentSong')));
      }
    },

    isCurrent: function (song) {
      var currentSong = this.get('currentSong');
      return (currentSong && song.id === this.get('currentSong').id) || false;
    },

    parse: function(attr) {
      if (attr.playlist) {
        var playlist = this.get('playlist') || new Playlist([]);
        playlist.reset(attr.playlist);
        attr.playlist = playlist;
      }

      if (attr.currentSong) {
        attr.currentSong = (attr.playlist || this.get('playlist')).get(attr.currentSong);
      }
      return attr;
    }
  });


  //static
  Model.getByName = function(name, callback) {
    console.log('getByName');
    // Fetches party id from it's name
    $.getJSON('api/getPartyByName/' + encodeURIComponent(name))

    // In case of ajax success :
    .success($.proxy(function(data) {

      // The server may still have encountered an internal error (typically "no party with such name")
      if (data.error) {
        callback(null);
      }
      // Otherwise, we can process the model
      else {
        var party = new Model(data);
        callback(party);
      }
    }, this))

    // In case of error :
    .error(function() {
      callback(null);
    });
  };

  // Returns the Model class
  return Model;

});
