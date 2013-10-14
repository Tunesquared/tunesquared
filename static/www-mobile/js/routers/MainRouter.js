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
    '../views/PartyView',
    '../views/MainView',
    '../views/searchView'
  ],

  function ($, Backbone, Session, PartyModel, SongModel, HomeView, PartyView, MainView, SearchView) {

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
          main: new MainView()
        };

        this.partyView = new PartyView();
        this.searchView = new SearchView();
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
        if (Session.get('party') != null) {
          window.location.hash = '#party/'+Session.get('party').get('name');
        }
        this.changePage('home');
      },

      party: function (name) {
        /* Ensures url matches app state:
          If party is not set or doesn't match url, we try to login to that party and go back to home page
          the latter will redirect back here if it succeeded otherwise login page will be shown
        */
        if (Session.get('party') == null || Session.get('party').get('name') !== name) {
          $.mobile.loading('show');
          Session.joinPartyByName(name, function() {
            $.mobile.loading('hide');
            window.location.href = '#';
          });
        } else {
          // If everything is fine, show party page
          this.partyView.setParty(Session.get('party'));
          this.pages.main.setContents(this.partyView.$el);
          this.changePage('main');
        }
      },

      search: function (query) {
        if (Session.get('party') == null) {
          window.location.href = '#';
        } else {
          this.searchView.setParty(Session.get('party'));
          this.searchView.search(decodeURIComponent(query));

          this.changePage('main');
          this.pages.main.setContents(this.searchView.$el);
        }
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
