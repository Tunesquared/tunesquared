// Desktop Router
// =============

// Includes file dependencies
define(["jquery", "backbone", "../models/Session", "../models/PartyModel", "../views/TestView" ], 
        function( $, Backbone, Session, Party, TestView ) {
    
    // Extends Backbone.Router
    var MainRouter = Backbone.Router.extend( {

        // The Router constructor
        initialize: function() {
        
            this.testView = new TestView({el: '#main_contents'});
            
            Session.fetch({
                success: function(){

                    Backbone.history.start();
                }
            });
        },

        // Backbone.js Routes
        routes: {
            '': 'test'
        },
        
        'test': function(){
            this.testView.render();
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