var redis = require("socket.io/node_modules/redis"),
    config = require('../../config'),
    pub = redis.createClient(config.redis_port || 6379, config.redis_host || '127.0.0.1'),
    sub = redis.createClient(config.redis_port || 6379, config.redis_host || '127.0.0.1');


var subscribers = {};

var pubsub = module.exports = {
    
    publish: function(channel, data){
        if(typeof data !== 'string')    data = JSON.stringify(data);
        
        pub.publish(channel, data);
    },
    
    subscribe: function(channel, listener){
        var subs = subscribers[channel];
        
        if(typeof subs === 'undefined'){
            subs = [];
            sub.subscribe(channel);
        }
        
        subs.push(listener);
        subscribers[channel] = subs;
    },
    
    unsubscribe: function(channel, listener){
        if(typeof subscribers[channel] === 'undefined') return;
        
        var chan = subscribers[channel];
        var id = chan.indexOf(listener);
        
        if(id === -1) return;
        
        chan.splice(id, 1);
        if(chan.length === 0){
            delete subscribers[channel];
            sub.unsubscribe(channel);
        }
    }
}

sub.on('message', function(channel, message){
    var listeners = subscribers[channel] ||[];
    
    var data = message;
    try{
        var data = JSON.parse(message);
    } catch (e){}
    
    for(var i in listeners){
        listeners[i](data);
    }
});