// Mobile Router
// =============

// Includes file dependencies
define([
    "jquery", 
    "../models/Session", 
    "../models/PartyModel", 
    "../models/SongModel", 
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

            this.partyView.model = Session.get("party");

            if(this.partyView.model !== null){
                $.mobile.changePage( "#party", { reverse: false, changeHash: false } );
            } 
            else {
                window.location.hash = "#";
            }
        },

        search: function (query) {
            console.log('#search');
            this.searchView.search(decodeURIComponent(query));
            $.mobile.changePage( "#search", { reverse: false, changeHash: false } );
        },

        share: function () {
            console.log('#share');
            $.mobile.changePage( "#share", { reverse: false, changeHash: false } );
        }
        


    } );
    

    // Returns the Router class
    return MainRouter;

} );