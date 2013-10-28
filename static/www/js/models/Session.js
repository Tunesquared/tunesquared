// AppState
// ==============
'use strict';
// Includes file dependencies
define(['jquery', 'underscore', 'backbone', 'models/Party'], function ($, _, Backbone, Party) {

  // The Model constructor
  var Session = Backbone.Model.extend({
    urlRoot: 'api/session',
    idAttribute: '_id',
    defaults: {
      party: null
    },

    /** Creates and joins a party with name `name`
      @param name name of the party to create
      @param callback called on server response, takes (err, party) as parameters
    */
    createParty: function (props, callback) {
      var self = this;
      var party = new Party(props);
      party.save(null, {
        success: function (party) {
          self.set('party', party);
          callback(null, party);
        },
        error: function (model, xhr) {
          callback(xhr.responseText);
        }
      });
    },

    removeCurrentParty: function (cb) {
      var self = this;
      var party = this.get('party');

      if(party && party.get('owner') !== this.get('publickey')){
        console.log(party);
        cb('You don\'t own this party or you are not currently in a party');
      } else {
        self.set('party', undefined);
        party.destroy({
          success: function(){

            cb();
          },
          error: function(dumb, xhr){
            cb(xhr.responseText);
          }
        });
      }
    },

    joinPartyByName: function (name, callback) {
      $.getJSON('api/joinPartyByName/' + encodeURIComponent(name))

      // In case of ajax success :
      .success($.proxy(function (data) {

        // The server may still have encountered an internal error (typically "no party with such name")
        if (data.error) {
          callback(data.error);
        }
        // Otherwise, we can process the model
        else {
          var party = new Party(data);

          this.set('party', party);
          callback(null);
        }
      }, this))

      // In case of error :
      .error(function (data) {
        callback('Sth went wrong...');
      });
    },

    parse: function (response) {

      return _.extend(response, {
        party: (response.party && new Party(response.party)) || null
      });
    }

  });

  return Session;

});
