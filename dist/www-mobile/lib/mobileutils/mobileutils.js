/*
  mobileutils.js
  Extends zepto (or jquery.. or any jquery-like lib) with some basic mobile utility plugins.
*/

define(['$'], function($){
  'use strict';

  var mobile = {};

  /* Overlay:
    Creates an overlay with the provided z_inedx or 10000 by default.
    Usage: var o = overlay(1337);
      o.show();  // shows overlay
      o.hide(); // hides overlay
  */
  var overlay = function(z_index) {
    var el = $('<div class="m-overlay" />').css('z-index', z_index || 10000);

    /* Counts the number of times it was shown and hidden to
      stay visible as long as 1 user at least want it visible */
    var oCount = 0;

    return {
      hide: function() {
        if (--oCount <= 0){
          oCount = 0;
          el.remove();
        }
        return this;
      },
      show: function() {
        oCount ++;
        el.appendTo('body');
        return this;
      }
    };
  };

  /* Tooltip */
  var tooltip = mobile.tooltip = (function() {

    var z_index = 10500;
    var ovl = overlay(z_index);


    function exports(contents, className) {
      var el = $('<div class="m-tooltip" />').append(contents).css('z-index', z_index + 1);

      if (className) {
        el.addClass(className);
      }

      return {
        show: function() {
          ovl.show();
          el.appendTo('body');
          el.offset({
            top: ($(window).height() - el.height())/2,
            left: ($(window).width() - el.width())/2
          });
          return this;
        },

        hide: function() {
          ovl.hide();
          el.remove();
          return this;
        }
      };
    }

    exports.ERROR = 'text-danger';

    return exports;
  })();

  mobile.alert = function(contents, status, duration) {
    var t = tooltip(contents, status).show();

    if (typeof contents === 'string') contents = '<p>' + contents +'</p>';

    window.setTimeout(function(){t.hide();}, duration || 1500);
  };

  /* Loading plugin */
  mobile.loading = (function() {
    var module = {};
    var el = tooltip($('<div class="m-loading" />'));
    module.exports = function(action) {
      switch (action) {
        case 'show':
            el.show();
          break;
        case 'hide':
            el.hide();
          break;
      }
      return this;
    };

    return module.exports;
  })();

  console.log('extending');

  $.extend($, {
    mobile: mobile
  });

  return $;
});
