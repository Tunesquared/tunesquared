
define(['text!templates/test.jst', 'backbone'], function(testTpl, Backbone){
    
    return Backbone.View.extend({
        
        initialize: function(){
            
            this.template = testTpl;
            
            console.log(testTpl);
        }
    });

});