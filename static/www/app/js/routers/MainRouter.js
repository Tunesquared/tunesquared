// Desktop Router
// =============

// Includes file dependencies
define([
    "jquery", 
    "backbone", 
    "models/Session", 
    "models/PartyModel", 
    "views/Navbar",
    "views/TestView",
    "views/HomeView"], 
function( 
    $, 
    Backbone, 
    Session, 
    Party, 
    Navbar,
    TestView,
    HomeView ) {
    
    // Extends Backbone.Router
    var MainRouter = Backbone.Router.extend( {

        // The Router constructor
        initialize: function() {
        
            this.testView = new TestView({el: '#main-contents'});
            this.homeView = new HomeView({el: '#main-contents'});

            var navbar = new Navbar({el: '#navbar'});
            navbar.render();
            
            Session.fetch({
                success: function(){

                    Backbone.history.start();
                }
            });
        },

        // Backbone.js Routes
        routes: {
            '': 'home',
            'test': 'test',
            'create': 'create',
            'search/:query': 'search',
            'join': 'join',
            '*page': '404'
        },
        
        '404': function(page){
            $('#main-contents').empty().append('<h1>Not found</h1><p>TODO : create a not found view<br/>NOT-TODO : create such an XSS : '+page+'</p>');
        },

        'test': function(){
            this.testView.render();
        },
        
        'home': function(){
            this.homeView.render();
            console.log("home");
        },

        'create': function(){
            /* 
                TODO : view to create a party
            */
        },

        'search': function(query){
            console.log("TODO");
        },

        'join': function(){
            console.log("TODO");
            $('#main-contents').empty().append("TODO : handle non-dj users");
        }

    } );

    // Returns the Router class
    return MainRouter;
} );