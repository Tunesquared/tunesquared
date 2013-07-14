var Framework = require('../framework');

var Party = require('../models/Party');

module.exports = Framework.Router({
    
    'api/session': function(req, res){
        
        if(req.session.partyId !== void 0){
            
            Party.model.findOne({_id: req.session.partyId}, function(err, mod){
                
                res.send({
                    party: mod
                });
            
            });
        } else {
            res.send({
                party: null
            });
        }
	}
});