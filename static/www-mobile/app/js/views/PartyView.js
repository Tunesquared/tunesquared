// Party View
// =============

// Includes file dependencies
define([ "jquery","../models/Session", "backbone" ], function( $ , Session) {

    // Extends Backbone.View
    var PartyView = Backbone.View.extend( {
        
        events: {
            "click [data-action=refresh]": "refresh",
            'keydown :input': 'logKey'
        },
        // The View Constructor
        initialize: function() {

            _.bindAll(this, "logKey", "render", "refresh");
            

        },

        // Renders the Party model on the UI
        render: function() {
            
            console.log("rendering");
            
            // Tests that the model properties were properly set:
            
            this.$('[data-display="party-name"]').text(this.model.get('name'));
            
            // Maintains chainability
            return this;
        },
        
        refresh: function(evt){
            evt.preventDefault();
            evt.stopPropagation();
            
            this.model.fetch();
        },

        logKey: function(e){
            //e.preventDefault();
            if (e.keyCode == 13) {                 
                var toAdd = $('input[data-type="search"]').val();
                console.log(toAdd)
                
                //there must be a better thing to trigger the pagechange (?)
                location.hash = "#search/" + toAdd
                //Make a searchrequest
            };
        }

    } );

    // Returns the View class
    return PartyView;

} );