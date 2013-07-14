// Song Model
// ==============

// Includes file dependencies
define([ "jquery", "backbone" ], function( $ ) {

    // The Model constructor
    var Model = Backbone.Model.extend( {
        urlRoot: 'api/song',
        idAttribute: "_id",
        defaults: {
            name: '',
            votes: 0
        },

        vote: function(callbacks){
            this.set("votes", this.get("votes")+1);
            this.save(void 0, callbacks);
        }

    } );


    //static
    Model.test = function(){
    	console.log("Test");
    };

    // Returns the Model class
    return Model;

} );