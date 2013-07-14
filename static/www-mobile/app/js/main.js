
requirejs.config({
    baseUrl: "m/app/js",
    paths: {
        'underscore': '/lib/underscore',
        'backbone': '/lib/backbone',
        'jquery': '/lib/jquery',
        'jquerymobile': '../../lib/jquerymobile',
        'search': '/lib/search',
        'text': '/lib/text'
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
        }
    }
});

require([
    "jquery",
    "routers/MainRouter"],
    
    /*
        The arguments of the callback function are the required objects 
        in the same order as in the list above. Therefore, we retreive jquery
        first, then the app object.
    */
    function($, MainRouter) {
        
        $( document ).on( "mobileinit",
            // Set up the "mobileinit" handler before requiring jQuery Mobile's module
            function() {
                // Prevents all anchor click handling including the addition of active button state and alternate link bluring.
                $.mobile.linkBindingEnabled = false;

                // Disabling this will prevent jQuery Mobile from handling hash changes
                $.mobile.hashListeningEnabled = false;
            }
        )

        require( [ "jquerymobile" ], function() {
            // Instantiates a new Backbone.js Mobile Router
            this.router = new MainRouter();
        });
        
}   );