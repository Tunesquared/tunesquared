/**
 * Framework.js
 *
 * Specific MVC framework. Enables fast development of a real time app using sessions and authentication.
 */

var fs = require('fs')
  , express = require('express')

var WebServer = require('./lib/WebServer')
  , SockServer = require('./lib/SocketServer')
  , Router = require('./lib/Router')
  , Controller = require('./lib/Controller')
  , db = require('./lib/db');

db.error(function(){
    console.log("Mongodb connection error");
    process.exit(1);
})
.open(function(){
    requireDir('models');
});

// Contains all registered controllers
var controllers = [];

var dirname = __dirname+'/..';

var Framework = module.exports = {};

Framework.Router = Router;
Framework.Controller = Controller;
Framework.pubsub = require('./lib/pubsub');
Framework.Model = require('./lib/Model');
Framework.sessionStore = require('./lib/sessionStore');

Framework.start = function(){

    // Creates the express app
    server = WebServer();
    
    // Creates socketio's server
    Framework.io = SockServer();
    
    // Includes all controllers (see controllers factories for details)
    requireDir('controllers');
    
    var app = WebServer.app;
    
    db.connect(function(){
        server.listen(app.get('port'), function(){
            console.log('Express server listening on port ' + app.get('port') + ' in ' + app.get('env') + ' mode.');
        });
    });
};

// Fetches a directory recursively and requires all of it's .js files
function requireDir(path){
    
    fs.readdir(path, function(err, files){
        
        if(err) throw err;
        
        for(var i in files){
            var p = path+'/'+files[i];
            var stats = fs.lstatSync(p);
            
            if(stats.isDirectory()){
                requireDir(p);
            } else if(stats.isFile() && /\.js$/.test(files[i])){
                require(dirname+'/'+p);
            }
        }
    });
}




