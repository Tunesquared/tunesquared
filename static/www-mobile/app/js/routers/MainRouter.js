// Mobile Router
// =============

// Includes file dependencies
define([ "jquery", "../models/Session", "../models/PartyModel", "../models/SongModel", "../views/HomeView", "../views/PartyView", "backbone" ], function( $, Session, PartyModel, SongModel, HomeView, PartyView ) {

    // Extends Backbone.Router
    var MainRouter = Backbone.Router.extend( {

        // The Router constructor
        initialize: function() {

            console.log("Router");

            Session.fetch({
                success: function(Session){
                    
                    console.log(Session.get('party'));

                    if(Session.get("party") === null) {
                        window.location.hash = "#";
                    }
                    else {
                        window.location.hash = "#party";
                    }

                     Backbone.history.start();
     
                },
                error: function(){
                    console.log("Session.fetch Error.. ")
                }
            });

            this.song = new SongModel();

            this.song.vote();

            this.homeView = new HomeView({el: "#home"});



            // Tells Backbone to start watching for hashchange events


        },

        // Backbone.js Routes
        routes: {

            "": "home",
            "party": "party"


            
            // "search/:query": "search" // this comes later

        },

        // Home method
        home: function() {

            // Programatically changes to the categories page
            $.mobile.changePage( "#home" , { reverse: false, changeHash: false } );

        },

        party: function(id){

            $.mobile.changePage( "#party", { reverse: false, changeHash: false } );
        },
        


    } );
    

    // Returns the Router class
    return MainRouter;

} );