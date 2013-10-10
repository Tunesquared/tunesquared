'use strict';

var express = require('express'),
    RedisStore = require('connect-redis')(express),
    config = require('../../config');


var host = config.redis_host || '127.0.0.1';
var port = config.redis_port || 6379;
var db = config.redis_db || '';
var pass = config.redis_pass || '';

var store = module.exports = new RedisStore({host: host, port: port, db: db, pass: pass});

store.on('disconnect', function(){
    throw 'Error : redis store disconnected';
});
