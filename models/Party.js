var Framework = require('../framework');
 
module.exports = Framework.Model('party', {

    name: String
    
}, {
    
    before: function(req, method, data, accept){
        
        if(method === 'create'){
            console.log(data);
            accept();
        }
    
    }
});