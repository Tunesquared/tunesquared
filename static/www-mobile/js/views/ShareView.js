/*
  ShareView.js

  A QR-Code make it easy to share the page with friends on the party. Get everyone involved and have fun!
*/

define([
	// libs
  '$', 'backbone', 'underscore',

  // application deps
  //'models/Party',

  // implicit libs
  'bs/collapse'

  //], function($, Backbone, _, Party) {

  ], function($, Backbone, _) {

  'use strict';


var ShareView = Backbone.View.extend({

    initialize: function() {
      // Binds event callbacks to be sure "this" refers to a PartyView instance
      //_.bindAll(this);
      this.template = _.template($('#shareTemplate').html());
      this.render();
    },

    render: function() {
    	this.$el.html(this.template({}));


    },

    clean: function(){

    },


    setParty: function(party) {
      /* events stuff */
      if (this.party) this.party.off(null, null, this);
      party.on('sync', this.render, this);

      this.party = party;
      this.render();
    },


  });

  return ShareView;
});
