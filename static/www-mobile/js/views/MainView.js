/*
  View shown when user is logged in. Handles the navbar and menu
*/

define([
  // libs
  '$', 'backbone', 'underscore', 'models/Session', 'bs/collapse'
  ], function($, Backbone, _, Session) {

  'use strict';

  var MainView = Backbone.View.extend({

    events: {
      'click #close-menu, .side-menu': 'onCloseMenu',
      'click #open-menu': 'onOpenMenu'
    },

    initialize: function() {
      // Binds event callbacks to be sure "this" refers to a HomeView instance
      _.bindAll(this, 'onCloseMenu', 'onOpenMenu');

      this.template = _.template($('#mainTemplate').html());

      Session.on('change sync', this.update, this);

      this.render();
    },

    /* Warning: for this specific view, render should only be called once.
    This avoids removing the child view and re-inserting it after */
    render: function() {
      this.$el.html(this.template(Session.toJSON()));

      this.menu = this.$('.side-menu');
      this.contents = this.$('#contents');
      this.$partyName = this.$('.partyName');
    },

    update: function() {
      this.$partyName.text(Session.get('party').get('name'));
    },

    onCloseMenu: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      this.menu.removeClass('active');
    },

    onOpenMenu: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      this.menu.addClass('active');
    },

    setContents: function(el) {
      this.contents.children().remove();
      this.contents.append(el);
    }
  });

  return MainView;
});
