// Mobile Router
// =============

// Includes file dependencies
define([
    "jquery", 
    "../models/Session", 
    "../models/Party", 
    "../models/Song", 
    "../views/HomeView", 
    "../views/PartyView", 
    "../views/SearchView", 
    "../views/ShareView", 
    "backbone"],

    function( $, Session, PartyModel, SongModel, HomeView, PartyView, SearchView, ShareView ) {

    // Extends Backbone.Router
    var MainRouter = Backbone.Router.extend( {

        // The Router constructor
        initialize: function() {

            console.log("Router");

            Session.fetch({
                success: function(Session){

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


            this.homeView = new HomeView({el: "#home"});

            this.partyView = new PartyView({el: "#party"});

            this.searchView = new SearchView({el: '#search'});

            this.shareView = new ShareView({el: '#share'});



        },

        // Backbone.js Routes
        routes: {

            "": "home",
            "party": "party",
            "share":"share",
            "search/:query":"search"

        },

        // Home method
        home: function() {

            // Programatically changes to the categories page
            $.mobile.changePage( "#home" , { reverse: false, changeHash: false } );

        },

        party: function(){

            this.partyView.setParty(Session.get("party"));
            $.mobile.changePage( "#party", { reverse: false, changeHash: false } );
            this.partyView.render();
        },

        search: function (query) {
            console.log('#search');
            this.searchView.search(decodeURIComponent(query));
            $.mobile.changePage( "#search", { reverse: false, changeHash: false } );
            this.searchView.render();
            

        },

        share: function () {
            console.log('#share');
            $.mobile.changePage( "#share", { reverse: false, changeHash: false } );
        }
        


    } );
    

    // Returns the Router class
    return MainRouter;

} );