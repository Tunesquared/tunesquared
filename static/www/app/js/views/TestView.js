
define(['backbone', 'text!templates/test.jst', 'text!templates/collec.jst', '../models/PartyModel', 'models/Session'], function(Backbone, testTpl, collecTpl, PartyModel, Session){
    
    
    var Parties = Backbone.Collection.extend({
        url: 'api/party',
        model: PartyModel
    });
    
    var PartyCollecView = Backbone.View.extend({
        
        initialize: function(){
            this.template = collecTpl;
            
            this.collection.on('sync destroy', this.render);
        },
        
        remove: function(evt){
            evt.preventDefault();
            
            var id = $(evt.currentTarget).attr('data-id');
            
            console.log("removing : "+id);
            
            this.collection.get(id).destroy();
        },
        
        isCurrent: function(model){
            console.log(model);
            console.log(Session);
            return model._id == Session.get('party').id;
        }
    
    });
    
    return Backbone.View.extend({
        template: testTpl,
        initialize: function(){
            this.collection = new Parties();
            this.collection.fetch();
        },
        
        postRender: function(){
            this.collecView = new PartyCollecView({
                el: this.$('[data-view=collec]'),
                collection: this.collection
            });
            
            this.collecView.render();
            
            this.partyNameInput = this.$('[name="party-name"]');
        },
        
        create: function(evt){
            evt.preventDefault();
            
            this.collection.create({name: this.partyNameInput.val()});
        }
    });

});