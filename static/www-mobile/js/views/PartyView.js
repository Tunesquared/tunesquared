/*
  PartyView.js

  View where one can see a party state and vote for most trending songs.
  Also handles the side menu.
*/
define(['$', 'backbone', 'underscore', 'bs/collapse'], function($, Backbone, _) {
  'use strict';

  var PartyView = Backbone.View.extend({

    events: {
      'click #close-menu, .side-menu': 'onCloseMenu',
      'click #open-menu': 'onOpenMenu'
    },

    initialize: function() {

      // Binds event callbacks to be sure "this" refers to a HomeView instance
      _.bindAll(this, 'onCloseMenu', 'onOpenMenu');

      this.template = _.template($('#partyTemplate').html());

      this.render();
    },

    render: function() {
      this.$el.html(this.template({}));

      this.menu = this.$('.side-menu');
    },

    setParty: function() {
      this.render();
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
    }
  });

  return PartyView;

  // Vote buttons demo logic
  /*
  $('.vote-buttons button').click(function(){
    if ($(this).hasClass('btn-success')) {
      $(this).parent().children('.btn-info').removeClass('btn-info').removeAttr('disabled').addClass('btn-danger');
      $(this).removeClass('btn-success').addClass('btn-info').attr('disabled', 'disabled');
    } else if ($(this).hasClass('btn-danger')) {
      $(this).parent().children('.btn-info').removeClass('btn-info').removeAttr('disabled').addClass('btn-success');
      $(this).removeClass('btn-danger').addClass('btn-info').attr('disabled', 'disabled');
    }
  });*/
});
