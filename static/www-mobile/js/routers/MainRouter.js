// Mobile Router
// =============

'use strict';

// Includes file dependencies
define([
    // libs
    '$',
    'backbone',

    // models
    '../models/Session',
    '../models/Party',
    '../models/Song',

    // views
    '../views/HomeView',
    '../views/PartyView'
  ],

  function ($, Backbone, Session, PartyModel, SongModel, HomeView, PartyView) {

    // Extends Backbone.Router
    var MainRouter = Backbone.Router.extend({

      // The Router constructor
      initialize: function () {

        console.log('Router');

        Session.fetch({
          success: function (Session) {

            if (Session.get('party') === null) {
              window.location.hash = '#';
            } else {
              window.location.hash = '#party/' + Session.get('party').get('name');
            }

            Backbone.history.start();

          },
          error: function () {
            console.log('Session.fetch Error.. ');
          }
        });

        this.root = $('#app');

        this.pages = {
          home: new HomeView(),
          party: new PartyView()
        };
      },

      // Backbone.js Routes
      routes: {
        '': 'home',
        'help': 'help',
        'party/:name': 'party',
        'share': 'share',
        'search/:query': 'search'
      },

      // Home method
      home: function () {
        this.changePage('home');
      },

      party: function () {
        this.pages.party.setParty(Session.get('party'));
        this.changePage('party');
      },

      search: function (query) {
        this.searchView.setParty(Session.get('party'));
        this.searchView.search(decodeURIComponent(query));
        $.mobile.changePage('#search', {
          reverse: false,
          changeHash: false
        });
        this.searchView.render();


      },

      share: function () {
        console.log('#share');
        this.shareView.setParty(Session.get('party'));
        $.mobile.changePage('#share', {
          reverse: false,
          changeHash: false
        });
        this.shareView.render();
      },

      changePage: function(pageName) {
        this.root.children().remove();
        this.root.append(this.pages[pageName].$el);
      }

    });


    // Returns the Router class
    return MainRouter;

  });
