/*
 * This is the main.js of welcome app.
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
        'components': 'components-build'
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


require(['jquery', 'react', 'components/CreateDialog', 'models/Session'],

    /*
        The arguments of the callback function are the required objects
        in the same order as in the list above. Therefore, we retreive jquery
        first, then the app object.
    */
    function($, React, CreateDialog, Session) {

        // TODO : refactor this in a react component
        var session = new Session();

        function onCreateHide() {
            React.unmountAndReleaseReactRootNode(document.getElementById('create-dialog'));
        }

        /* We can still use jquery to make sure the dom is completely loaded even though
            it's very unlikely it isn't already loaded. */
        $(function() {
            $('#create').click(function(){
                React.renderComponent(
                  CreateDialog({session: session, onHide: onCreateHide}),
                  document.getElementById('create-dialog')
                );
            });
        });
});
