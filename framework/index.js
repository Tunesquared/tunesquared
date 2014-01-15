/**
 * Framework.js
 *
 * Specific MVC framework. Enables fast development of a real time app using sessions and authentication.
 */
'use strict';

var fs = require('fs'),
  express = require('express'),

  WebServer = require('./lib/WebServer'),
  SockServer = require('./lib/SocketServer'),
  Router = require('./lib/Router'),
  Controller = require('./lib/Controller'),
  db = require('./lib/db'),
  Sessions = require('./lib/Sessions'),
  guid = require('./lib/utils').guid;

db.error(function () {
  console.log('Mongodb connection error');
  process.exit(1);
})
  .open(function () {
    requireDir('models');
  });

var dirname = __dirname + '/..';

var Framework = module.exports = {};

Framework.Router = Router;
Framework.RESTRouter = require('./lib/RESTRouter');
Framework.Controller = Controller;
Framework.pubsub = require('./lib/pubsub');
Framework.sessionStore = require('./lib/sessionStore');
Framework.session = Sessions.addHook;


// Middleware to make sure session is well populated
Sessions.addHook(function(sess) {
  sess.publickey = guid();
});

Framework.start = function () {

  // Includes all controllers (see controllers factories for details)
  requireDir('controllers');

  // Creates the express app
  var server = WebServer();

  // Creates socketio's server
  Framework.io = SockServer();

  var app = WebServer.app;

  db.connect(function () {
    server.listen(app.get('port'), function () {
      console.log('Express server listening on port ' + app.get('port') + ' in ' + app.get('env') + ' mode.');
    });
  });
};

// Fetches a directory recursively and requires all of it's .js files

function requireDir(path) {

  var files = fs.readdirSync(path);

  for (var i in files) {
    var p = path + '/' + files[i];
    var stats = fs.lstatSync(p);

    if (stats.isDirectory()) {
      requireDir(p);
    } else if (stats.isFile() && /\.js$/.test(files[i])) {
      require(dirname + '/' + p);
    }
  }
}
