// AppState
// ==============

// Includes file dependencies
define([ "jquery", "../models/PartyModel", "backbone", ], function( $, PartyModel ) {

    // The Model constructor
    var Model = Backbone.Model.extend( {
        urlRoot: 'api/appstate',
        idAttribute: "_id",
        defaults: {
            party: null //((Math.random() > 0.5) ? null : new PartyModel({name: "testparty", playlist: []}))
        },

        joinPartyByName: function(name, callback){ 
            console.log("joinPartyByName");
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
            },

            fetch: function(opts) {
                var mod = this;

                setTimeout(function(){
                    opts.success(mod);
                }, 1000);
            }

    } );

    return new Model();

} );

