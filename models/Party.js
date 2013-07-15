var Framework = require('../framework');
 
module.exports = Framework.Model('party', {

    name: String,
    owner: String
    
}, {
    namespace: 'api',
    before: function(req, method, data, accept){
        console.log(req.session);
        if(method === 'create'){
            data.owner = req.session.publickey;
        }
        console.log(data); 
        accept();
    
    }
});