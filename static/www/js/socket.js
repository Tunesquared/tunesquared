// Socket.io module

define(["socket.io"], function(){

    var socket = io.connect();

    // Enable debug features
    if (typeof DEBUG === 'undefined') DEBUG = true;

    if(DEBUG){

        // Allows server to push log messages into client's console
        socket.on('log', function (data) {
            if(typeof data !== 'string') data = JSON.stringify(data);
            console.log("SOCKET : Server message : "+data);
        });
    }


    return socket;
});
