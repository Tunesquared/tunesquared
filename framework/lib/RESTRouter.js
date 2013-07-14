var Router = require('./Router');

var exclude = require('./utils').exclude;

module.exports = function(model, baseUrl){
    
    var routes = {};
    
    routes['post:'+baseUrl] = function(req, res, next){
        console.log("create "+baseUrl);
        
        var data = req.body;
        
        model.before(req, 'create', data, function(){
            
            model.model.create(data, function(err, mod){
                
                model.after(req, 'create', data, function(){
                    res.send({_id: mod._id});
                });
            });
        
        });
    };
    
    // TODO : read collection
    routes[baseUrl+'/:id'] = function(req, res, next){
        res.send('read');
        
        var id = req.param('id');
        
        model.before(req, 'read', id, function(){
            
            model.model.findOne({_id: id}, function(err, mod){
                
                model.after(req, 'read', id, function(){
                    res.send(mod);
                });
            });
        
        });
    };
    
    routes['put:'+baseUrl+'/:id'] = function(req, res, next){
        res.send('updated');
        
        var id = req.param('id');
        var set = req.body;
        
        model.before(req, 'update', {_id: id, set: set}, function(){
            
            model.model.findByIdAndUpdate(id, { $set: set}, function(err, mod){
                
                model.after(req, 'update', {_id: id, set: set}, function(){
                    res.end();
                });
            });
        
        });
    };
    
    routes['del:'+baseUrl+'/:id'] = function(req, res, next){
        res.send('deleted');
        
        var id = req.param('id');
        
        model.before(req, 'delete', id, function(){
            
            model.model.remove({_id: id}, function(err, mod){
                
                model.after(req, 'delete', id, function(){
                    res.end();
                });
            });
        
        });
    };
    
    return Router(routes);
};