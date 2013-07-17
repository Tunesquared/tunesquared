'use strict';

var Model = require('../framework').Model;

var Party = module.exports = Model('party', {

  name: String,
  owner: String

}, {
  namespace: 'api',
  before: function (req, method, data, callback) {
    console.log(req.session);
    if (method === 'create') {
      data.owner = req.session.publickey;
    } else if (method === 'delete' || method === 'update') {
      Party.model.find({_id: data._id}, function(err, resp){
        if(err) callback(err);
        else if (resp.owner !== req.session.publickey) {
          callback('You are not allowed to delete this party', 403);
        }
      });
    }
    console.log(data);
    Model.before(req, method, data, callback);
  },

  after: function (req, method, data, callback) {
    if (method === 'create') {
      console.log('afterCreate');
      req.session.partyId = data._id;
      req.session.save(function () {
        callback(null, {
          _id: data._id,
          owner: data.owner
        });
      });
    } else {
      Model.after(req, method, data, callback);
    }
  }
});
