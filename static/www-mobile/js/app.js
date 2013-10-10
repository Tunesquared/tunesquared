define([
    "jquery",
    "routers/MainRouter",
    "jquerymobile"
  ],

  /*
    The arguments of the callback function are the required objects
    in the same order as in the list above. Therefore, we retreive jquery
    first, then the app object.
  */

  function ($, MainRouter) {
    "use strict";
    // Instantiates a new Backbone.js Mobile Router
    new MainRouter();

  });
