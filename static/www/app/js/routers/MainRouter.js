// Desktop Router
// =============

// Includes file dependencies
define(["jquery", "backbone" ], 
        function( $, Backbone, WelcomeView ) {
    
    // Extends Backbone.Router
    var MainRouter = Backbone.Router.extend( {

        // The Router constructor
        initialize: function() {
        
        },

        // Backbone.js Routes
        routes: {
        
        },
        
        'welcome': function(){
            
        },
        
        'newParty': function(){
        
        },
        
        'party': function(id){
        
        }

    } );

    // Returns the Router class
    return MainRouter;
} );