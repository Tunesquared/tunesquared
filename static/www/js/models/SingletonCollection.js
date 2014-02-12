/*
  A collection that is fetched only once and is global
*/

define(['backbone', 'underscore'], function(Backbone, _) {
  'use strict';

  var fetch = Backbone.Collection.prototype.fetch;

  var Singleton = Backbone.Collection.extend({

    initialize: function() {
      this.fetched = false;
    },

    fetch: function(opts) {
      var self = this, options, success = (opts && opts.success) || undefined;

      if (this.fetched === false) {
        options = _.extend(opts || {}, {
          success: function() {
            self.fetched = true;
            if (success)
              success.apply(this, arguments);
          }
        });
        fetch.call(this, options);
      } else {
        if (success) {
          success(this);
        }
      }
    }
  });

  return Singleton;
});
