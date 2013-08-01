'use strict';

// Song Model
// ==============

// Includes file dependencies
define(['jquery', 'backbone'], function ($, Backbone) {

    var voteTypes = ['Yes', 'No'];

    // The Model constructor
    var Model = Backbone.Model.extend({
        urlRoot: 'api/song',
        idAttribute: '_id',
        defaults: {
          name: '',
          votes: 0
        },

        voteYes: function (callbacks) {
          this.vote('yes', callbacks);
        },
        voteNo: function (callbacks) {
          this.vote('no', callbacks);
        },
        vote: function (type, callbacks) {
            callbacks = callbacks || {};
          // yes -> Yes
          type = type.charAt(0).toUpperCase() + type.substring(1);

          if (voteTypes.indexOf(type) === -1) {
            throw new Error('Invalid vote method : ' + type);
          }

          $.get('/api/vote' + type + 'Song/' + this.id)
            .success(function () {
              if(callbacks.success) callbacks.success();
            })
            .error(function () {
              if(callbacks.error) callbacks.error();
            });

        }
      });

      // Returns the Model class
      return Model;

    });
