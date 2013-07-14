var Router = require('./Router');


module.exports = function(model, baseUrl){
    
    var routes = {};
    
    routes['post:'+baseUrl] = function(req, res, next){
        console.log("create "+baseUrl);
        
        var data = req.body;
        
        model.before(req, 'create', data, function(){
            
            model.model.create(data, function(err, mod){
                
                //model.after(
            });
        
        });
    };
    
    routes[baseUrl+'/:id'] = function(req, res, next){
        res.send('read');
    };
    
    routes['put:'+baseUrl+'/:id'] = function(req, res, next){
        res.send('updated');
    };
    
    routes['del:'+baseUrl+'/:id'] = function(req, res, next){
        res.send('deleted');
    };
    
    return Router(routes);
};