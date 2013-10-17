'use strict';

// Song Model
// ==============

// Includes file dependencies
define(['$', 'backbone'], function ($, Backbone) {

    var voteTypes = ['yes', 'no'];

    // The Model constructor
    var Model = Backbone.Model.extend({
        urlRoot: 'api/song',
        idAttribute: '_id',
        defaults: {
          name: '',
          votes: 0,
          vote: 'none'
        },

        voteYes: function (callbacks) {
          this.vote('yes', callbacks);
        },
        voteNo: function (callbacks) {
          this.vote('no', callbacks);
        },
        vote: function (type, callbacks) {
          callbacks = callbacks || {};

          var previous = this.get('vote');
          var self = this;


          if (voteTypes.indexOf(type) === -1) {
            throw new Error('Invalid vote method : ' + type);
          }

          // yes -> Yes
          var uType = type.charAt(0).toUpperCase() + type.substring(1);


          $.ajax({
            url:'/api/vote' + uType + 'Song/' + this.id,
            success: function () {
              if(callbacks.success) callbacks.success();
            },
            error: function () {
              self.set('vote', previous);
              if(callbacks.error) callbacks.error();
            }
          });

          //early update to give a feeling of responsiveness
          this.set('vote', type);
        }
      });

      // Returns the Model class
      return Model;

    });
