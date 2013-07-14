var Framework = require('../framework');
 
module.exports = Framework.Model('party', {

    name: String
    
}, {
    namespace: 'api',
    before: function(req, method, data, accept){
        
        console.log(data); 
        accept();
    
    }
});