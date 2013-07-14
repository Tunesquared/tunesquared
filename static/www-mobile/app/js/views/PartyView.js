// Party View
// =============

// Includes file dependencies
define([ "jquery", "backbone" ], function( $ ) {

    // Extends Backbone.View
    var PartyView = Backbone.View.extend( {
        
        events: {
            "click [data-action=refresh]": "refresh"
        },
        // The View Constructor
        initialize: function() {

            _.bindAll(this, "render", "refresh");
            
            this.model.on('sync', this.render);

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
        }

    } );

    // Returns the View class
    return PartyView;

} );