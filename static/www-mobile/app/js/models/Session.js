// Session
// ==============

// Includes file dependencies
define([ "jquery", "underscore", "../models/PartyModel", "backbone", ], function( $, _, PartyModel ) {

    // The Model constructor
    var Model = Backbone.Model.extend( {
        urlRoot: 'api/session',
        idAttribute: "_id",
        defaults: {
            party: null //((Math.random() > 0.5) ? null : new PartyModel({name: "testparty", playlist: []}))
        },

        joinPartyByName: function(name, callback){ 
            console.log("joinPartyByName");
            // Fetches party id from it's name
            $.getJSON('api/joinPartyByName/'+ encodeURIComponent(name))

            // In case of ajax success :
            .success($.proxy(function(data){
                
                // The server may still have encountered an internal error (typically "no party with such name")
                if(data.error){
                    callback(data.error);
                } 
                // Otherwise, we can process the model
                else {
                    var party = new Model(data);

                    this.set("party", party);
                    callback(null);
                }
            }, this))
            
            // In case of error :
            .error(function(data){
                callback("Sth went wrong...");
            });
        },
        
        leave: function(callback){
            var self = this;
            
            $.get('api/leaveParty')
                .success(function(){
                    self.set('partyId', null);
                    if(callback) callback(null);
                })
                .error(function(){
                    if(callback) callback("Network error");
                });
        
        },
        
        parse: function(response){
            return _.extend(response, {party: new PartyModel(response.party)});
        }

    } );

    return new Model();

} );

