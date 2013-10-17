

define(['backbone', 'underscore', '$'], function(Backbone, _, $) {
  'use strict';

  var SongView = Backbone.View.extend({

    events: {
      'click .addButton': 'onAdd'
    },

    initialize: function() {
      // _.bindAll(this);

      this.template = _.template($('#searchSongTemplate').html());

      this.model.on('change', this.render, this);
      this.render();
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    },

    release: function() {
      this.model.off(null, null, this);
    },

    onAdd: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      this.trigger('addSong', this.model);
    }
  });

  return SongView;
});
