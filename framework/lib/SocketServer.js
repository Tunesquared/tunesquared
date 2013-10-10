var Session = require('express/node_modules/connect/lib/middleware/session/session');

var io;

var controllers = [];

var handshake = function (cb) {
  cb(null, true);
};

var Server = module.exports = function () {

  if (io === void 0) {

    var config = require('../../config.js');

    var WebServer = require('./WebServer'),
      connect = require('express/node_modules/connect'),
      cookie = require('express/node_modules/cookie'),
      sessionStore = require('./sessionStore'),
      Socket = require('./Socket');

    var RedisStore = require('socket.io/lib/stores/redis'),
      redis = require('socket.io/node_modules/redis'),
      pub = redis.createClient(config.redis_port || 6379, config.redis_host || '127.0.0.1'),
      sub = redis.createClient(config.redis_port || 6379, config.redis_host || '127.0.0.1'),
      client = redis.createClient(config.redis_port || 6379, config.redis_host || '127.0.0.1');

    pub.auth(config.redis_pass);
    sub.auth(config.redis_pass);
    client.auth(config.redis_pass);

    io = require('socket.io').listen(WebServer());

    /* Sessions */
    io.configure(function () {
      io.set('authorization', function (handshakeData, callback) {

        if (handshakeData.headers.cookie) {
          // Read cookies from handshake headers
          var cookies = cookie.parse(handshakeData.headers.cookie);

          // We're now able to retrieve session ID
          var sessionID = connect.utils.parseSignedCookie(cookies['connect.sid'], process.env.COOKIE_SCRET || '8168008135');
        }

        // No session? Refuse connection
        if (!sessionID) {
          callback('No session', false);
        } else {

          // Store session ID in handshake data, we'll use it later to associate
          // session with open sockets
          handshakeData.sessionID = sessionID;

          sessionStore.get(sessionID, function (err, session) {
            if (!err && session) {
              var req = {
                sessionID: sessionID,
                sessionStore: sessionStore
              };
              handshake(callback, new Session(req, session));
            } else {
              callback("could not retreive session", false);
            }
          });
        }
      });

      io.set('store', new RedisStore({
        redis: redis,
        redisPub: pub,
        redisSub: sub,
        redisClient: client
      }));
    });

    io.on('connection', function (sock) {
      var socket = Socket(sock);
      for (var i in controllers) {
        controllers[i].listen(socket);
      }
    });
  }
  return io;
}

Server.addController = function (controller) {
  controllers.push(controller);

  if (controller.handshake) {
    var next = handshake;
    handshake = function (cb, session) {
      controller.handshake(session, function (err) {
        if (err) cb(err, false);
        else next(cb, session);
      });
    }
  }
}
