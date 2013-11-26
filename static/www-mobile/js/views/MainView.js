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
      'click #close-menu': 'onCloseMenu',
      'click .side-menu': 'onSideMenuClick',
      'click #open-menu': 'onOpenMenu',
      'click #navbar-refresh': 'onRefresh',
      'submit #navbarSearch': 'onSearch',
      // 'keyup #navbarSearch': 'onLiveSearch',
      'mousedown #searchButton': 'onSearch'
    },

    initialize: function() {
      // Binds event callbacks to be sure "this" refers to a HomeView instance
      _.bindAll(this, 'onCloseMenu', 'onSideMenuClick', 'onOpenMenu', 'onLiveSearch', 'onSearch');

      this.template = _.template($('#mainTemplate').html());

      Session.on('change sync', this.update, this);

      this.isMenuOpened = false;

      this.render();
    },

    /* Warning: for this specific view, render should only be called once.
    This avoids removing the child view and re-inserting it after */
    render: function() {
      this.$el.html(this.template(Session.toJSON()));

      this.menu = this.$('.side-menu');
      this.contents = this.$('#contents');
      this.$partyName = this.$('.partyName');
      this.$searchInput = this.$('#searchInput');
    },

    update: function() {
      if (Session.get('party'))
        this.$partyName.text(Session.get('party').get('name'));
    },

    /*
      In small screen mode, side menu element occupies 100% screen width
      A click on this element not originating from above is considered an
      intent to close the menu
    */
    onSideMenuClick: function(evt) {
      if($(evt.target).hasClass('side-menu')) {
        this.onCloseMenu();
      }
    },

    onCloseMenu: function() {
      if (this.isMenuOpened) {
        window.history.back();
      }
    },

    hideMenu: function() {
      this.menu.removeClass('active');
      this.isMenuOpened = false;
    },

    showMenu: function() {
      this.menu.addClass('active');
      this.isMenuOpened = true;
    },

    onOpenMenu: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      window.location.hash = 'menu';
    },

    onRefresh: function(evt) {
      evt.stopPropagation();
      evt.preventDefault();


      var p = Session.get('party');
      if(p){
        $.mobile.loading('show');
        p.fetch({
          success: function(){
            $.mobile.loading('hide');
          },
          error: function(){
            $.mobile.loading('hide');
          }
        });
      }
    },

    onLiveSearch: function() {
      if (this.$searchInput.val() !== '')
        this.doSearch();
    },

    onSearch: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      this.doSearch();
    },

    doSearch: function() {
      var q = this.$searchInput.val();
      window.location.hash = 'search/'+encodeURIComponent(q);
    },

    setContents: function(el, mode) {
      if (mode === 'search') {
        this.$searchInput.addClass('active');
      } else {
        this.$searchInput.removeClass('active');
      }
      this.contents.children().remove();
      this.contents.append(el);
    }
  });

  return MainView;
});
