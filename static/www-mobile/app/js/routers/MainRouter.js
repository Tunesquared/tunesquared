// Mobile Router
// =============

// Includes file dependencies
define([ "jquery", "../models/PartyModel", "../views/PartyView", "../views/HomeView", "backbone" ], function( $, PartyModel, PartyView, HomeView ) {

    // Extends Backbone.Router
    var MainRouter = Backbone.Router.extend( {

        // The Router constructor
        initialize: function() {
        
            this.party = new PartyModel();
            this.partyView = new PartyView({ el: "#party", model: this.party});
            
            this.homeView = new HomeView({el: "#home"});

            // Tells Backbone to start watching for hashchange events
            Backbone.history.start();

        },

        // Backbone.js Routes
        routes: {

            "": "home",
            "party/:id": "party"
            
            // "search/:query": "search" // this comes later

        },

        // Home method
        home: function() {

            // Programatically changes to the categories page
            $.mobile.changePage( "#home" , { reverse: false, changeHash: false } );

        },
        
        party: function(id){
        
            /* 
             * Assuming joinParty is a method that connects you to a party.
             * it would take a success and error callback
             */
            
            $.mobile.loading( "show" );
            
            this.joinParty(id, {
                success: function(){
                    $.mobile.changePage( "#party", { reverse: false, changeHash: false } );
                },
                
                error: function(reason){
                    // Navigates back to home page
                    // TODO : show error message
                    window.location.hash = '#';
                    $.mobile.loading('hide');
                    
                    // show error message
                    $.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, $.mobile.pageLoadErrorMessage, true );

                    // hide after delay
                    setTimeout( $.mobile.hidePageLoadingMsg, 1500 );
                }
            });
            
            
        },
        
        /*
         * Allows user to join a party with the given name.
         * This method asks the server to return the party model identified 
         * by this name. It sets it's parsed attributes and triggers a sync 
         * event. (Event used by PartyView to refresh itself).
         */
        joinParty: function(name, cbs){
    
            // Fetches party id from it's name
            $.getJSON('api/getPartyByName/'+name)
            
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
        }

    } );
    

    // Returns the Router class
    return MainRouter;

} );