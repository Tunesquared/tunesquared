

define(['backbone', 'underscore', '$'], function(Backbone, _, $) {
  'use strict';

  var SongView = Backbone.View.extend({

    events: {
      'click .voteYes': 'onVoteYes',
      'click .voteNo': 'onVoteNo'
    },

    initialize: function() {
      _.bindAll(this, 'onVoteNo', 'onVoteYes', 'onVoteComplete');

      this.template = _.template($('#songTemplate').html());

      this.model.on('change', this.render, this);
      this.render();
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    },

    onVoteNo: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      this.model.voteNo({
        success: this.onVoteComplete,
        error: this.onVoteComplete
      });
    },

    onVoteYes: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      this.model.voteYes({
        success: this.onVoteComplete,
        error: this.onVoteComplete
      });
    },

    onVoteComplete: function() {
      this.trigger('vote');
    },

    release: function() {
      this.model.off(null, null, this);
    }
  });

  return SongView;
});
