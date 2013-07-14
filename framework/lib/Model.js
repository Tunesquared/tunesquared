var mongoose = require('mongoose');
var utils = require('./utils');
var RESTRouter = require('./RESTRouter');

var auth_noop = function(sender, method, model, cb){ cb(true); };
var opt_defaults = {
    before: auth_noop,
    after: auth_noop,
    allowLive: false,
    namespace: ''
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
    
    RESTRouter(Model, utils.path.join(options.namespace, name));
    
    
    return Model;
}