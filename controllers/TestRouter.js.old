var Framework = require('../framework');

var Party = require('../models/Party');

module.exports = Framework.Router({
    
    'api/getPartyByName/:name': function(req, res){
        var name = req.param('name');
        
        Party.model.findOne({name: name}, function(err, mod){
            
            res.setHeader('Content-Type', 'application/json');
            if(err){
                res.send('{"error": "'+err+'"}');
            } else if(mod === null){
                res.send(JSON.stringify({error: "Cannot find party "+name}));
            } else {
                res.send(mod);
            }
        });
    }
});