requirejs.config({
  paths: {
    'underscore': '../lib/underscore',
    'backbone': '../lib/backbone',
    'search': '../lib/search',
    'text': '../lib/text',
    'zepto': '../lib/zepto',
    'bs': '../lib/bootstrap/js',
    'jquery': '../lib/zepto2jquery'
  },

  shim: {
    'backbone': {
      //These script dependencies should be loaded before loading
      //backbone.js
      deps: ['underscore', '$'],
      //Once loaded, use the global 'Backbone' as the
      //module value.
      exports: 'Backbone'
    },
    'underscore': {
      exports: '_'
    },

    'zepto': {
      exports: 'Zepto'
    },

    'bs/collapse': {
      deps: ['jquery', 'bs/transition'],
      exports: '$'
    },

    'bs/transition': {
      deps: ['jquery'],
      exports: '$'
    }
  },

  map: {
    '*': {
      '$': 'zepto'
    }
  }
});

require(['app']);
