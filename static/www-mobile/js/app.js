define([
    '$',
    'routers/MainRouter',
    'lib/fastclick'
  ],
  function ($, MainRouter, FastClick) {
    'use strict';

    FastClick.attach(document.body);

    // Instantiates a new Backbone.js Mobile Router
    new MainRouter();
  });
