/*
  PartyView.js

  View where one can see a party state and vote for most trending songs.
  Also handles the side menu.
*/
define([
  // libs
  '$', 'backbone', 'underscore',

  // application deps
  'views/SongView',

  // implicit libs
  'bs/collapse'

  ], function($, Backbone, _, SongView) {

  'use strict';

  var PartyView = Backbone.View.extend({

    initialize: function() {
      // Binds event callbacks to be sure "this" refers to a PartyView instance
      _.bindAll(this, 'addSong');

      this.template = _.template($('#partyTemplate').html());
      this.childViews = [];
    },

    render: function() {
      // Renders only if there is a party
      if (!this.party) return;

      this.clean();

      this.$el.html(this.template({}));

      this.songsList = this.$('#partySongs');

      this.populateSongsList();
    },

    populateSongsList: function() {
      this.party.get('playlist').each(this.addSong);
    },

    addSong: function(s) {
      var sv = new SongView({model: s});
      this.songsList.append(sv.el);
      sv.on('vote', this.party.fetch);

      this.childViews.push(sv);
    },

    setParty: function(party) {
      /* events stuff */
      if (this.party) this.party.off(null, null, this);
      party.on('sync', this.render, this);

      this.party = party;
      this.render();
    },

    clean: function() {
      for (var i = 0 ; i < this.childViews.length ; i++) {
        this.childViews[i].release();
      }

      this.childViews.length = 0;
    }
  });

  return PartyView;
});
