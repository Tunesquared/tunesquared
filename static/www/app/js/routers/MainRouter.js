// Desktop Router
// =============

// Includes file dependencies
define(["jquery", "backbone", "../models/Session", "../models/PartyModel" ], 
        function( $, Backbone, Session, Party ) {
    
    // Extends Backbone.Router
    var MainRouter = Backbone.Router.extend( {

        // The Router constructor
        initialize: function() {
            Session.fetch({
                success: function(){
                    console.log("cool");
                    Session.joinPartyByName('hqhq', function(err){
                    
                        console.log("Joined party :");
                        console.log(err);
                        
                        console.log("Creating test party");
                        
                        
                        var party = new Party({name: "test"});
                        
                        party.save({
                            success: function(){
                                console.log("test party created");
                            },
                            
                            error: function(){
                                console.log("Cannot create test party");
                            
                            }
                        });
                        
                        
                    });
                }
            });
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