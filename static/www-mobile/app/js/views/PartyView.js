// Party View
// =============
'use strict';

// Includes file dependencies
define(['jquery', 'text!templates/playlistsong.jst', 'backbone', 'underscore'], function($, songTemplate, Backbone, _) {

  var PartyResultView = Backbone.View.extend({
    tagName: 'li',

    events: {
      'click [ref=openmenu]': 'onClick', //ref
      //'click a ': 'onClick',
      'click .yes': 'onYes',
      'click .no': 'onNo'
    },

    initialize: function() {
      _.bindAll(this, 'onClick', 'onYes', 'onNo', 'render');

      this.template = _.template(songTemplate);

    },

    render: function() {
      console.log('render listel');
      console.log(this.model);
      var listel = this.template({
        result: this.model.toJSON()
      });

      this.$el.html(listel);

      this.$('[ref="asking"]').hide();


    },

    onClick: function(evt) {
      evt.preventDefault();

      this.$('[ref="asking"]').toggle();


      $('[ref="asking"] .yes').button().buttonMarkup('refresh');
      $('[ref="asking"] .no').button().buttonMarkup('refresh');

    },

    onYes: function(evt) {
      var self = this;
      console.log(this);
      evt.preventDefault();
      console.log('yes');
      $.mobile.loading('show');
      this.model.voteYes({

        success: function() {
          self.trigger('voted');
          $.mobile.loading('hide');
        },

        error: function() {
          $.mobile.loading('hide');
        }
      });

      this.$('[ref="asking"]').hide();


    },

    onNo: function(evt) {
      evt.preventDefault();
      var self = this;
      console.log('no');
      $.mobile.loading('show');
      this.model.voteNo({

        success: function() {
          self.trigger('voted');
          $.mobile.loading('hide');
        },

        error: function() {
          $.mobile.loading('hide');
        }
      });
      this.$('[ref="asking"]').hide();
    }
  });

  // Extends Backbone.View
  var PartyView = Backbone.View.extend({

    events: {
      'click [ref=refresh]': 'refresh',
      'keydown :input': 'logKey'
    },
    // The View Constructor
    initialize: function() {

      _.bindAll(this, 'logKey', 'render', 'refresh');
    },

    setParty: function(party) {
      if (this.party != null)
        this.party.off(null, null, this);

      this.party = party;

      this.party.on('sync change', this.render);
    },

    // Renders the Party model on the UI
    render: function() {

      console.log('rendering party');

      console.log(this.party.get('playlist').length);

      //self = this;

      $.mobile.loading('show');

      this.$('#dynamicFieldList').empty();


      this.party.get('playlist').each(_.bind(function(song) {

        $.mobile.loading('hide');

        var $result = new PartyResultView({
          model: song,
        });
        var self = this;
        $result.on('voted', function() {
          self.party.fetch();
        });
        $result.render();

        this.$('#dynamicFieldList').append($result.$el);

        this.dataLoading = false;

      }, this));

      this.$('#dynamicFieldList').listview('refresh');

      // Tests that the model properties were properly set:

      this.$('[data-display="party-name"]').text(this.party.get('name'));

      // Maintains chainability
      return this;
    },


    refresh: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      console.log('refresh');

      this.$('#dynamicFieldList').empty();

      this.party.fetch();
    },

    logKey: function(e) {
      //e.preventDefault();
      if (e.keyCode == 13) {
        var toAdd = $('input[data-type="search"]').val();
        console.log(toAdd);

        //there must be a better thing to trigger the pagechange (?)
        location.hash = '#search/' + toAdd;
        //Make a searchrequest
      }
    }

  });

  // Returns the View class
  return PartyView;

});
