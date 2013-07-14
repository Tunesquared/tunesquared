/**
 *  Router.js
 *
 * A router allows the server to handle http requests. Handlers' syntax is the same as in express.
 * function(req, res, next){ /* do stuff * / }
 *
 * A route is declared according to the following syntax :
 * [methods:]actual/route
 * Methods are one or multiple comma separated values from get, post, put or del.
 * If no method is specified, then it will only respond to "defaultMethod" request types.
 * Use a wildcard * to respond to all methods.
 *
 * @constructor Router([params,] handlers);
 * Constructs a new router with the specified parameters and the routes declared in handlers.
 * Possible parameters are :
 * - defaultMethod (String : get, post, put, del or *) : http method to use by default
 * - basePath (String) : path prepended to all routes in the router.
 *
 * @example
    var ExampleRouter = require('framework').Router(
    {
        basePath: '/api'
    },
    {
        'say-hello': function(req, res){    // GET /api/say-hello?name=world
            res.end('hello '+req.query.name);
        },
        
        'post:say-hello': function(req, res){   // POST /api/say-hello \n name=world
            res.end('hello '+req.body.name);
        
        }
    });
 *
 */

// Utility method to join HTTP paths without worrying about '/'
var joinPath = require('./utils').path.join;

// Http methods allowed
var allowedMethods = ['get', 'put', 'post', 'del'];

// Regexes used to parse routes
var methodRegex = new RegExp("^(("+allowedMethods.join('|')+"|\\*)(,("+allowedMethods.join('|')+"|\\*))*)?:", "i");
var pathRegex = new RegExp("^(("+allowedMethods.join('|')+"|\\*)(,("+allowedMethods.join('|')+"|\\*))*:)?([a-z0-9\\_/:-]+)", "i");

var app = require('./WebServer').app;

/**
 * Router's constructor
 */
module.exports = function(){
    
    var router = Router.apply({}, arguments);
    
    router.listen(app);
    return router;
    
}

var Router = function(params, handlers){

    // Parses arguments
    if(typeof handlers == 'undefined'){
        handlers = params;
        params = {};
    } else if(typeof params == 'undefined'){
        params = handlers = {};
    }
    
    // Gets parameters
    var defaultMethod = params.defaultMethod || 'get';
    var basePath = params.basePath || '/';
    
    // Method called by the framework to start listening to an express app
    this.listen = function(app){
        
        for(var i in handlers){
            // We get the actual path
            var path = (pathRegex.exec(i) || [])[5];
            // If no path is specified, we may have a problem
            if(typeof path === 'undefined') throw "Invalid path syntax in router";
            // appends path to the basePath
            path = joinPath(basePath, path);
            
            // Gets the method part of the route
            var method = ((methodRegex.exec(i) || [])[1] || defaultMethod).toLowerCase();
            if(method == '*') method = allowedMethods.join(',');
            var methods = method.split(',');

            // And applies those methods to the express app
            for(var j in methods){
                if(allowedMethods.indexOf(methods[j]) !== -1){
                    app[methods[j]](path, handlers[i]);
                }
            }
        }
    }
    
    return this;
}

