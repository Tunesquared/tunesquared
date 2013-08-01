
var SocketServer = require('./SocketServer');
var joinPath = require('./utils').path.join;

module.exports = function(){
    var controller = Controller.apply({}, arguments);

    SocketServer.addController(controller);
    return controller;
}

var Controller = function(params, handlers){

    // Parses arguments
    if(typeof handlers == 'undefined'){
        handlers = params;
        params = {};
    } else if(typeof params == 'undefined'){
        params = handlers = {};
    }

    var namespace = params.namespace || '';
    var connection = params.connection; // Connection listener

    this.handshake = params.handshake; // Handshake listener

    this.listen = function(socket){

        for(var i in handlers){
            if(connection) connection(socket);

            var route = (namespace) ? joinPath(namespace, i) : i;
            socket.on(route, handlers[i]);
        }
    }
    return this;
}
