// Party Model
// ==============

// Includes file dependencies
define([ "jquery", "backbone", "models/Session" ], function( $, Backbone, Session) {

    // The Model constructor
    var Model = Backbone.Model.extend( {
        urlRoot: 'api/party',
        idAttribute: "_id",
        defaults: {
            name: '',
            playlist: []
        }
    } );


    //static
    Model.getByName = function(name, callback){ 
    	console.log("getByName");
        // Fetches party id from it's name
            $.getJSON('api/getPartyByName/'+ encodeURIComponent(name))

            // In case of ajax success :
            .success($.proxy(function(data){
                
                // The server may still have encountered an internal error (typically "no party with such name")
                if(data.error){
                    callback(null);
                } 
                // Otherwise, we can process the model
                else {
                    var party = new Model(data);
                    callback(party);
                }
            }, this))
            
            // In case of error :
            .error(function(data){
                callback(null);
            });
    }
    
    // Returns the Model class
    return Model;

} );