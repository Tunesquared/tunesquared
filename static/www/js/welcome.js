/*
 * This is the main.js of welcome app.
*/

'use strict';

requirejs.config({
    paths: {
        'lib': '../lib',
        'socket.io': '../socket.io/socket.io',
        'underscore': '../lib/underscore',
        'backbone': '../lib/backbone',
        'bootstrap': '../lib/bootstrapAMD/js',
        'jquery': '../lib/jquery',
        'wizard': '../lib/wizard',
        'react': '../lib/react',
        'components': 'components-build',
        'qrgenerator': '../lib/qrcode'
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

        'qrgenerator': {
            exports: 'QRCode'
        }

    }
});


require(['jquery', 'react', 'components/CreateDialog', 'models/Session'],

    /*
        The arguments of the callback function are the required objects
        in the same order as in the list above. Therefore, we retreive jquery
        first, then the app object.
    */
    function($, React, CreateDialog, Session) {

        mixpanel.track('show welcome');

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

        $(function() {
            $('#create2').click(function(){
                React.renderComponent(
                  CreateDialog({session: session, onHide: onCreateHide}),
                  document.getElementById('create-dialog')
                );
            });
        });
});
