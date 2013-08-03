
var Session = require('express/node_modules/connect/lib/middleware/session/session'),
    Cookie = require('express/node_modules/connect/lib/middleware/session/cookie'),
    sessionStore = require('./sessionStore');


// /!\ to use without 'new'
var Socket = module.exports = function(io){

    io.sessionID = io.handshake.sessionID;

    io.session = (function(){
        var req = {
            sessionID: io.handshake.sessionID,
            sessionStore: sessionStore
        };

        var _session = req.session = null;

        var isValid = false;

        var Sess = function(cb){

            // Ensures to refresh the session when we need it
            if(!isValid){
                sessionStore.get(io.handshake.sessionID, function (err, session) {
					if (!err && session) {
						_session = new Session(req, session);

						cb(_session);
					} else {
						console.log("error : no session found");
                        cb(null);
					}
				});
            } else {
                cb(_session);
            }
        }

        Sess.invalidate = function(){
            isValid = false;
        }

        return Sess;
    })();

    var on = io.on;
    io.on = function(evt, cb){
        on.call(io, evt, proxyHandler(cb, io));
    };

    return io;
}

function proxyHandler(handler, socket){

    return function(){
        var args = [socket];

        [].push.apply(args, arguments);

        handler.apply(this, args);
    }
}
