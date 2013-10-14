define([
  // libs
  '$', 'backbone', 'underscore',

  // application deps
  'views/SongView',

  // implicit libs
  'bs/collapse'

  ], function($, Backbone, _, SongView) {

  'use strict';

  var SearchView = Backbone.View.extend({

    setParty: function(party) {
      this.party = party;
      this.render();
    },

    search: function() {
      console.warn('not implemented');
    }
  });

  return SearchView;
});
