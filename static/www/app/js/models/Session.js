// AppState
// ==============

// Includes file dependencies
define([ "jquery", "../models/PartyModel", "backbone", ], function( $, PartyModel ) {

    // The Model constructor
    var Model = Backbone.Model.extend( {
        urlRoot: 'api/session',
        idAttribute: "_id",
        defaults: {
            party: null
        },

        joinPartyByName: function(name, callback){ 
            console.log("getByName");
            // Fetches party id from it's name
            $.getJSON('api/party/joinByName/'+ encodeURIComponent(name))

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
        }

    } );

    return new Model();

} );

