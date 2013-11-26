/*
  HomeView.js -- screen shown when a non-logged user enters the app.

  Goals: Shows a login screen and some help to enable the user to access the app.

*/
define(['backbone', 'underscore', '$', 'models/Session'], function(Backbone, _, $, Session) {
  'use strict';

  var HomeView = Backbone.View.extend({

    events: {
      'submit #joinForm': 'onJoinSubmit'
    },

    initialize: function() {

      // Binds event callbacks to be sure "this" refers to a HomeView instance
      _.bindAll(this, 'onJoinSubmit');

      this.template = _.template($('#homeTemplate').html());

      this.render();
    },

    render: function() {
      this.$el.html(this.template({}));

      this.partyNameInput = this.$('#partyNameInput');
    },

    /* Method called when user submits the join form */
    onJoinSubmit: function(evt) {
      /* Takes care of the event */
      evt.preventDefault();
      evt.stopPropagation();

      /* Gets the input data */
      var pName = this.partyNameInput.val();

      if (pName.length === 0) {
        console.log('TODO: display error');
      } else {
        this.join(pName);
      }
    },

    /* Joins the party with the given partyName */
    join: function(partyName) {
      $.mobile.loading('show');
      Session.joinPartyByName(partyName , function(err){
        $.mobile.loading('hide');
        if(err !== null) {
          $.mobile.alert('Cannot join party "' + partyName + '"<br />Did you type it right ?', $.mobile.tooltip.ERROR);
        }
        else {
          window.location.hash = '#party/' + Session.get('party').get('name');
        }
      });
    }
  });

  return HomeView;
});
