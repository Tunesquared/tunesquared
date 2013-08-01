// Party View
// =============

// Includes file dependencies
define([ "jquery", "text!templates/playlistsong.jst", "backbone" ], function( $ , songTemplate) {

    var PartyResultView = Backbone.View.extend({
        tagName: 'li',

        events: {
            'click [ref=openmenu]': 'onClick', //ref
            //'click a ': 'onClick',
            'click .yes': 'onYes',
            'click .no' : 'onNo'
        },

        initialize: function() {
            _.bindAll(this, 'onClick', 'onYes', 'onNo');
            
            this.template = _.template(songTemplate);
            
        }, 

        render: function() {
            console.log("render listel");
            console.log(this.model);
            listel = this.template({result: this.model.toJSON()})



            this.$el.html(listel);

            this.$('[ref="asking"]').hide();

            
        },
        
        onClick: function(evt){
            evt.preventDefault();

            this.$('[ref="asking"]').toggle();


            $('[ref="asking"] .yes' ).button().buttonMarkup( "refresh" );
           $('[ref="asking"] .no' ).button().buttonMarkup( "refresh" );
        
        },

        onYes: function(evt){
            evt.preventDefault();
            console.log('yes');
            this.$('[ref="asking"]').hide();
            


        },

        onNo: function(evt){
            evt.preventDefault();
            console.log("no")
            this.$('[ref="asking"]').hide();
        }
    });

    // Extends Backbone.View
    var PartyView = Backbone.View.extend( {
        
        events: {
            "click [data-action=refresh]": "refresh",
            'keydown :input': 'logKey'
        },
        // The View Constructor
        initialize: function(params) {

            _.bindAll(this, "logKey", "render", "refresh");
        },

        setParty: function (party){
            if(this.party != null)
                this.party.off(null, null, this);

            this.party = party;

            this.party.on("sync change", this.render );
        },

        // Renders the Party model on the UI
        render: function() {
            
            console.log("rendering party");

            console.log( this.party.get("playlist").length)

            //self = this;

            $.mobile.loading( "show" );

            this.$('#dynamicFieldList').empty();


            this.party.get("playlist").each(function(song){

                $.mobile.loading('hide');

                var $result = new PartyResultView({
                    model: song, 
                });
                $result.render();
                
                this.$('#dynamicFieldList').append($result.$el);
                
                this.dataLoading = false; 

            });

            this.$('#dynamicFieldList').listview('refresh');
            
            // Tests that the model properties were properly set:
            
            this.$('[data-display="party-name"]').text(this.party.get('name'));
            
            // Maintains chainability
            return this;
        },

        
        refresh: function(evt){
            evt.preventDefault();
            evt.stopPropagation();

            this.$('#dynamicFieldList').empty();
            
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