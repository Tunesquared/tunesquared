var mongoose = require('mongoose');
var utils = require('./utils');

var auth_noop = function(sender, method, model, cb){ cb(true); };
var opt_defaults = {
    socketAPI: false,
    webAPI: false,
    before: auth_noop,
    after: auth_noop,
    allowLive: false
};

module.exports = function(name, scheme, options){
    
    options = utils.defaults(options, opt_defaults);
    
    var schema = mongoose.Schema(scheme);
    var mod = mongoose.model(name, schema);

    var Model = {
        model: mod,
        schema: schema,
        before: options.before,
        after: options.after
    }
    
    return Model;
}