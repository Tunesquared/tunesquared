'use strict';

var express = require('express'),
  sessionStore = require('./sessionStore'),
  path = require('path');

var dirname = __dirname + '/../..';
var app = express();
var server = null;
var config = require('../../config');

var WebServer = module.exports = function () {

  if (!server) {
    buildServer(config);
  }

  return server;
};

function buildServer(config) {
  var i;

  // Web server port
  app.set('port', process.env.PORT || config.web_port || 5000);

  // View settings
  app.set('views', dirname + '/views');
  app.set('view engine', 'ejs');

  // Favicon
  app.use(express.favicon());

  // Logs stuff in development
  if (app.get('env') == 'developement') app.use(express.logger('dev'));

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: process.env.SESSION_SECRET || '8168008135',
    store: sessionStore
  }));
  app.use(require('./Session'));
  app.use(app.router);
  if (app.get('env') == 'developement') app.use(express.errorHandler());


  /** Static **/

  if (config.static) {
    for (i in config.static) {
      app.use(i, express.static(path.join(dirname, config.static[i])));
    }
  } else {
    app.use('/', express.static(path.join(dirname, 'static')));
  }

  // One last middleware
  if ('development' == app.get('env')) app.use(express.errorHandler());

  server = require('http').createServer(app);

  for (i in WebServer.routers) {
    WebServer.routers[i].listen(app);
  }
}

WebServer.app = app;
WebServer.routers = [];
