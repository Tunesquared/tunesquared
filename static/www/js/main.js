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
        'text': '/lib/text',
        'wizard': '/lib/wizard',
        'templates': '../templates',
        'react': '/lib/react',
        'components': 'components-build'
    },

    shim: {
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


require(['jquery', 'react', 'components/App'],

    /*
        The arguments of the callback function are the required objects
        in the same order as in the list above. Therefore, we retreive jquery
        first, then the app object.
    */
    function($, React, App) {
        /* We can still use jquery to make sure the dom is completely loaded even though
            it's very unlikely it isn't already loaded. */
        $(function() {
            React.renderComponent(
              App(),
              document.getElementById('app')
            );
        });
});
