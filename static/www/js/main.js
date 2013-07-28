/*
 * main.js is the only file explicitly loaded by require (see index.html)
 * It will load every main classes needed by app to initialize.
 * One doesn't need to specify here sub-dependencies.
*/

'use strict';

requirejs.config({
    baseUrl: 'js',
    paths: {
        'socket.io': '../socket.io/socket.io',
        'underscore': '/lib/underscore',
        'backbone': '/lib/backbone',
        'bootstrap': '/lib/bootstrap/js',
        'jquery': '/lib/jquery',
        'less': '/lib/less',
        'wizard': '/lib/wizard',
        'react': '/lib/react',
        'components': 'components-build',
        'search': '/lib/search'
    },

    shim: {
        'wizard' : {
            deps: ['jquery']
        },

        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },

    },

    deps: ['less']
});


require(['jquery', 'react', 'components/App', 'models/Session', 'controllers/PubSubController'],

    /*
        The arguments of the callback function are the required objects
        in the same order as in the list above. Therefore, we retreive jquery
        first, then the app object.
    */
    function($, React, App, Session, PubSubCtrl) {

        var session = new Session();
        new PubSubCtrl(session);

        /* We can still use jquery to make sure the dom is completely loaded even though
            it's very unlikely it isn't already loaded. */
        $(function() {
            React.renderComponent(
              App({session: session}),
              document.getElementById('app')
            );
        });
});
