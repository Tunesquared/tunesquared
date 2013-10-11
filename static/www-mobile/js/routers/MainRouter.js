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
    '../views/PartyView'
  ],

  function ($, Backbone, Session, PartyModel, SongModel) {

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
              window.location.hash = '#party';
            }

            Backbone.history.start();

          },
          error: function () {
            console.log('Session.fetch Error.. ');
          }
        });

/*
        this.homeView = new HomeView({
          el: '#home'
        });

        this.partyView = new PartyView({
          el: '#party'
        });

        this.searchView = new SearchView({
          el: '#search'
        });

        this.shareView = new ShareView({
          el: '#share'
        });*/



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

      },

      party: function () {
        this.partyView.setParty(Session.get('party'));
        $.mobile.changePage('#party', {
          reverse: false,
          changeHash: false
        });
        this.partyView.render();
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
      }



    });


    // Returns the Router class
    return MainRouter;

  });
