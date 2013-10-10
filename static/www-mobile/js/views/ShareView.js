// Share View
// =============

'use strict';

// Includes file dependencies
define(['jquery', '../models/Session', 'backbone', 'underscore'], function($, Session, Backbone, _) {

    // Extends Backbone.View
    var ShareView = Backbone.View.extend({

        events: {
            'submit [action=leave]': 'leave'
        },
        // The View Constructor
        initialize: function() {

            _.bindAll(this, 'leave');


        },

        setParty: function(party) {
            if (this.party != null)
                this.party.off(null, null, this);

            this.party = party;

            this.party.on('sync change', this.render);
        },

        render: function(){
            this.$('[ref="party-name"]').text(this.party.get('name'));
        },

        leave: function(evt) {
            $.mobile.loading('show');
            console.log('leaving');

            evt.preventDefault();
            evt.stopPropagation();

            Session.leave(function(err) {

                console.log(err);

                $.mobile.loading('hide');

                if (err !== null) {
                    // show error message
                    $.mobile.showPageLoadingMsg($.mobile.pageLoadErrorMessageTheme, $.mobile.pageLoadErrorMessage, true);
                    // hide after delay
                    setTimeout($.mobile.hidePageLoadingMsg, 1500);
                } else {
                    window.location.hash = '#';
                }
            });

            return false;

        }



    });

    // Returns the View class
    return ShareView;

});
