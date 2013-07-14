/*
 * main.js is the only file explicitly loaded by require (see index.html)
 * It will load every main classes needed by app to initialize.
 * One doesn't need to specify here sub-dependencies.
*/

requirejs.config({
    baseUrl: "app/js",
    paths: {
        'socket.io': '../socket.io/socket.io',
        'underscore': '/lib/underscore',
        'backbone2': '/lib/backbone2',
        'backbone': '/lib/backbone',
        'bootstrap': '/lib/bootstrap/js/bootstrap',
        'jquery': '/lib/jquery',
        'less': '/lib/less',
        'text': '/lib/text'
    },
    
    map: {
        '*': {
            'backbone': 'backbone2'
        },
        'backbone2': {
            'backbone': 'backbone'
        }
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


require(["jquery", "routers/MainRouter"],
    
    /*
        The arguments of the callback function are the required objects 
        in the same order as in the list above. Therefore, we retreive jquery
        first, then the app object.
    */
    function($, Router) {
        /* We can still use jquery to make sure the dom is completely loaded even though
            it's very unlikely it isn't already loaded. */
        $(function() {
            this.router = new Router();
        });
});