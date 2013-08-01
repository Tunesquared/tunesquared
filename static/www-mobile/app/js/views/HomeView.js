// Home View
// =============
    "use strict";
// Includes file dependencies
define([ "jquery", "../models/Session", "backbone" ], function( $, Session , Backbone ) {

    // Extends Backbone.View
    var HomeView = Backbone.View.extend( {

        events: {

            "submit [action=join]": "join",

        },

        // The View Constructor
        initialize: function() {
            _.bindAll(this, "join");


            //this.joinText = this.$('[name="text-join"]');
        },

        join: function(evt){
            $.mobile.loading( "show" );

            this.joinText = this.$('[name="text-join"]');

            console.log("joining");

            evt.preventDefault();
            evt.stopPropagation();

            var partyName = this.joinText.val();

            Session.joinPartyByName(partyName , function(err){

                console.log(err);

                $.mobile.loading('hide');

                if(err !== null) {
                    // show error message
                    $.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, $.mobile.pageLoadErrorMessage, true );
                    // hide after delay
                    setTimeout( $.mobile.hidePageLoadingMsg, 1500 );
                }
                else {
                    window.location.hash = "#party";
                }
            });

            return false;

        }


    } );

    // Returns the View class
    return HomeView;

} );
