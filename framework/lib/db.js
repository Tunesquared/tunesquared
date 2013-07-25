
var mongoose = require('mongoose');

var errorCbs = [];
var openCbs = [];

module.exports = {

    connect: function(cb){
        openCbs.push(cb);

        mongoose.connect('mongodb://localhost/test');

        var db = mongoose.connection;

        db.on('error', function(){
            for(var i in errorCbs){
                errorCbs[i]();
            }
        });
        db.once('open', function(){
            for(var i in openCbs){
                openCbs[i](db);
            }
        });

        return this;
    },

    error: function(cb){
        errorCbs.push(cb);
        return this;
    },

    open: function(cb){
        openCbs.push(cb);
        return this;
    }

};
