requirejs.config({
  paths: {
    'underscore': '../lib/underscore',
    'backbone': '../lib/backbone',
    'search': '../lib/search',
    'text': '../lib/text',
    'zepto': '../lib/zepto',
    'bs': '../lib/bootstrapAMD/js',
    'jquery': '../lib/zepto2jquery',
    'mobileutils': '../lib/mobileutils/mobileutils',
    'lib': '../lib'
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
      deps: ['$'],
      exports: '_'
    },

    'zepto': {
      exports: 'Zepto'
    }
  },

  map: {
    '*': {
      '$': 'mobileutils'
    },
    'mobileutils': {
      '$': 'zepto'
    }
  }
});

require(['app']);
