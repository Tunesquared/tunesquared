'use strict';

var guid = require('./utils').guid;


var Sessions = module.exports = {
  hooks: [],
  middleware: function(req, res, next){
    var session = req.session;

    if (!session.init) {
      for (var i = 0 ; i < Sessions.hooks.length ; i++) {
        Sessions.hooks[i](session);
      }
      session.init = true;
      session.save(function(err){
        if (err) throw err;
        next();
      });
    } else {
      next();
    }
  },

  addHook: function(hook) {
    Sessions.hooks.push(hook);
  },

  removeHook: function(hook) {
    Sessions.hooks.splice(Sessions.hooks.indexOf(hook), 1);
  }
};
