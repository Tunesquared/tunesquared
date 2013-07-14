// Party Model
// ==============

// Includes file dependencies
define([ "jquery", "backbone" ], function( $ ) {

    // The Model constructor
    var Model = Backbone.Model.extend( {
        urlRoot: 'api/party',
        idAttribute: "_id",
        defaults: {
            name: '',
            playlist: []
        }
    } );


    /*

    //static
    Model.getByName = function(name, callback){ 
    	console.log("getByName");
        // Fetches party id from it's name
            $.getJSON('api/party/getByName/'+ encodeURIComponent(name))

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
 */

 /*
    joinParty: function(name, cbs){
    
            // Fetches party id from it's name
            $.getJSON('api/getPartyByName/'+encodeURIcomponent(name);
            
            // In case of ajax success :
            .success($.proxy(function(data){
                
                // The server may still have encountered an internal error (typically "no party with such name")
                if(data.error){
                    cbs.error(data.error);
                } 
                // Otherwise, we can process the model
                else {
                    
                    // We parse the data
                    data = this.party.parse(data);
                    // Then set it
                    this.party.set(data);
                    
                    // And finally trigger the sync event
                    this.party.trigger('sync');
                    
                    cbs.success();
                }
            }, this))
            
            // In case of error :
            .error(function(data){
                cbs.error("Server error, please try again");
            });
        } */
    // Returns the Model class
    return Model;

} );