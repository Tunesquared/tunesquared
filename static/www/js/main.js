/*
 * main.js is the only file explicitly loaded by require (see index.html)
 * It will load every main classes needed by app to initialize.
 * One doesn't need to specify here sub-dependencies.
 */

'use strict';

requirejs.config({
  paths: {
    'lib': '../lib',
    'socket.io': '/socket.io/socket.io',
    'underscore': '../lib/underscore',
    'backbone': '../lib/backbone',
    'bootstrap': '../lib/bootstrapAMD/js',
    'jquery': '../lib/jquery',
    'bootstrap-slider': '../lib/slider/js/bootstrap-slider',
    'wizard': '../lib/wizard',
    'react': ['//fb.me/react-0.5.1.min', '../lib/react'],
    'components': 'components-build',
    'search': '../lib/search',
    'json': '../lib/json3',
    'noext': '../lib/noext',
    'qrgenerator': '../lib/qrcode'
  },

  shim: {
    'backbone': {
      //These script dependencies should be loaded before loading
      //backbone.js
      deps: ['underscore', 'jquery'],
      //Once loaded, use the global 'Backbone' as the
      //module value.
      exports: 'Backbone',

    },
    'underscore': {
      exports: '_'
    },

    'swfobject': {
      exports: 'swfobject'
    },

    'qrgenerator': {
      exports: 'QRCode'
    }

  }
});

require(['app']);
