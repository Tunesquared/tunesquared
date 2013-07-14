// Share View
// =============

// Includes file dependencies
define([ "jquery","../models/Session", "backbone" ], function( $ , Session) {

    // Extends Backbone.View
    var ShareView = Backbone.View.extend( {
        
        events: {
            "submit [action=leave]": "leave"
        },
        // The View Constructor
        initialize: function() {

            _.bindAll(this, "leave");
            

        },

        leave: function(evt){
            $.mobile.loading( "show" );
            console.log("leaving");
            
            evt.preventDefault();
            evt.stopPropagation();

            Session.leave(function(err){
            
                console.log(err);
                
                $.mobile.loading('hide');
                
                if(err !== null) {
                    // show error message
                    $.mobile.showPageLoadingMsg( $.mobile.pageLoadErrorMessageTheme, $.mobile.pageLoadErrorMessage, true );
                    // hide after delay
                    setTimeout( $.mobile.hidePageLoadingMsg, 1500 );
                }
                else {
                    window.location.hash = "#";
                }
            }
            );
            
            return false;

        }

        

    } );

    // Returns the View class
    return ShareView;

} );