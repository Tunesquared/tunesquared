// Mobile Router
// =============

// Includes file dependencies
define([ "jquery", "../models/PartyModel", "../models/SongModel", "backbone" ], function( $, PartyModel, SongModel ) {

    // Extends Backbone.Router
    var MainRouter = Backbone.Router.extend( {

        // The Router constructor
        initialize: function() {

            console.log("Router");

            this.song = new SongModel();

            this.song.vote();

            PartyModel.getByName("party1", function(party){console.log(party)});
        /*
            this.party = new PartyModel();
            this.partyView = new PartyView({ el: "#party", model: this.party});
            
            this.homeView = new HomeView({el: "#home"});
*/
            // Tells Backbone to start watching for hashchange events
            Backbone.history.start();

        },

        // Backbone.js Routes
        routes: {

            //"": "home"
            
            // "search/:query": "search" // this comes later

        },

        // Home method
        home: function() {

            // Programatically changes to the categories page
            $.mobile.changePage( "#home" , { reverse: false, changeHash: false } );

        }
        
       

    } );
    

    // Returns the Router class
    return MainRouter;

} );