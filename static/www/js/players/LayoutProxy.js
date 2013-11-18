/*
  Provides access to the single music visualisation layout manager (see LayoutManager.js) of the app
  (it seems quite logical to have only one visualisation for the whole app).

  Layout is accessed with getLayout, modified with setLayout.

  Events:
    change(oldLayout, newLayout) : emitted when layout is being changed (old layout may be null)
    removed(layout) : emitted when current layout is removed
*/

define(['backbone', 'underscore'], function(Backbone, _) {
  'use strict';

  var LayoutProxy = {
    layout: null,

    setLayout: function(layout) {
      this.trigger('change', this.layout, layout);
      this.layout = layout;
    },

    getLayout: function() {
      return this.layout;
    },

    remove: function() {
      var layout = this.layout;
      this.layout = null;
      this.trigger('removed', layout);

    }
  };

  _.extend(LayoutProxy, Backbone.Events);

  return LayoutProxy;
});
