// Desktop Router
// =============

'use strict';

// Includes file dependencies
define([

    // libs
    'jquery',
    'backbone',
    'react',

    // app
    'models/Session',
    'components/App'
  ],
  function (
    $,
    Backbone,
    React,
    Session,
    App) {

    // Extends Backbone.Router
    var MainRouter = Backbone.Router.extend({

      // The Router constructor
      initialize: function () {
        var app = App({loading: true});
        React.renderComponent(
          app,
          document.getElementById('app')
        );

        // main-contents views
        /*this.testView = new TestView({
          el: '#main-contents'
        });
        var homeView = this.homeView = new HomeView({
          el: '#main-contents'
        });


        // secondary views (such as dialog-based)
        this.createView = new CreateView({
          el: '#create-dialog'
        });

        new Navbar({
          el: '#navbar'
        });
        new PlaylistView({
          el: '#playlist'
        });*/

        Session.fetch({
          success: function () {
            // TODO : lookup session state to find where to put the user, depending on the current hash
            // Shows home view by default on startup
            // console.log(app);
            window.setTimeout(function(){
              app.setProps({loading: false});
            }, 1000);
            Backbone.history.start();
          }
        });
      },

      // Backbone.js Routes
      routes: {
        /*'': 'home',
        'test': 'test',
        'create': 'create',
        'search/:query': 'search',
        'join': 'join',
        '*page': '404'*/
      },

      /*'404': function (page) {
        this.clearDialogs();
        $('#main-contents').empty().append('<h1>Not found</h1><p>TODO : create a not found view<br/>NOT-TODO : create such an XSS : ' + page + '</p>');
      },

      'test': function () {
        this.clearDialogs();
        this.testView.render();
      },

      'home': function () {
        // TODO : see if user is in a party, otherwise redirect to create
        this.clearDialogs();
        this.homeView.render();
      },

      'create': function () {
        this.createView.show();
      },

      'search': function (query) {
        this.clearDialogs();
        console.log('TODO');
      },

      'join': function () {
        this.clearDialogs();
        console.log('TODO');
        $('#main-contents').empty().append('TODO : handle non-dj users');
      }*/

    });

    // Returns the Router class
    return MainRouter;
  });
