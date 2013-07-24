'use strict';

var mongoose = require('mongoose');
var utils = require('./utils');
var RESTRouter = require('./RESTRouter');

module.exports = function(name, scheme, options){

    options = utils.defaults(options || {}, opt_defaults);

    var schema = mongoose.Schema(scheme);
    var mod = mongoose.model(name, schema);

    var Model = {
        model: mod,
        schema: schema,

        /**
            Called before an action is performed on the model
            function(req, method, data, cb)
            method is one of 'create', 'read', 'update', 'delete'
            cb takes either (err, [statusCode]) in case of error or (null, data) in case of success
            delegate to Model.before for default implementation
        */
        before: options.before,
        /**
            Called right after an action is performed, see before
            delegate to Model.after for default implementation
        */
        after: options.after
    };

    if(options.exposeAPI)
        RESTRouter(Model, utils.path.join(options.namespace, name));


    return Model;
};

module.exports.before = function(req, method, data, cb){
    switch(method){
        case 'create':
            cb(null, data);
            break;
        case 'read':
            cb(null, data);
            break;
        case 'update':
            cb();
            break;
        case 'delete':
            cb();
            break;
    }
};

module.exports.after = function(req, method, data, cb){
    switch(method){
        case 'create':
            cb(null, {_id: data._id});
            break;
        case 'read':
            cb(null, data);
            break;
        case 'update':
            cb();
            break;
        case 'delete':
            cb();
            break;
    }
};

var opt_defaults = {
    exposeAPI: false,
    before: module.exports.before,
    after: module.exports.after,
    namespace: ''
};

