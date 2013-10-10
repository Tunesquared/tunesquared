requirejs.config({
  paths: {
    'underscore': '../lib/underscore',
    'backbone': '../lib/backbone',
    'jquery': '../lib/jquery',
    'jquerymobile': '../lib/jquerymobile',
    'search': '../lib/search',
    'text': '../lib/text'
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
    'jquerymobile.config': ['jquery'],
    'jquerymobile': ['jquery','jquerymobile.config']
  }
});

require(['app']);
