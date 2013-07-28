/*
  Creates a router implementing REST for the given model on the given URL
*/

'use strict';

var Router = require('./Router'),
  capitalize = require('./utils').capitalize;

function sendError(res, err, status) {
  res.statusCode = status || 400;
  if (err.name === 'MongoError')
    res.send(err.err);
  else if (err.name === 'ValidationError')
    res.send(JSON.stringify(err.errors));
  else
    res.send(err);
}

var RESTRouter = module.exports = function (model, baseUrl) {
  var self = this;

  var routes = {};

  routes['post:' + baseUrl] = function (req, res) {

    var data = req.body;

    self.beforeCreate(req, data, function (err, data) {
      if (err != null)
        return sendError(res, err, data);
      model.create(data, function (err, mod) {
        if (err != null) {
          console.log(JSON.stringify(err));
          return sendError(res, err);
        }
        self.afterCreate(req, mod, function (err, data) {
          if (err != null)
            return sendError(res, err, data);

          res.send(data);
        });
      });

    });
  };

  routes[baseUrl] = function (req, res) {
    self.beforeRead(req, null, function (err, data) {
      if (err != null)
        return sendError(err, data);

      model.find({}, function (err, coll) {
        if (err != null)
          return sendError(res, err);

        self.afterRead(req, coll, function (err, data) {
          if (err != null)
            return sendError(res, err, data);
          res.send(data);
        });
      });
    });
  };

  routes[baseUrl + '/:id'] = function (req, res) {

    var id = req.param('id');

    self.beforeRead(req, id, function (err, data) {
      if (err != null)
        return sendError(res, err, data);

      model.findOne({
        _id: id
      }, function (err, mod) {
        if (err != null)
          return sendError(res, err);
        self.afterRead(req, mod, function (err, data) {
          if (err != null)
            return sendError(res, err, data);
          res.send(data);
        });
      });

    });
  };

  routes['put:' + baseUrl + '/:id'] = function (req, res) {
    res.send('updated');

    var id = req.param('id');
    var set = req.body;

    self.beforeUpdate(req, {
      _id: id,
      set: set
    }, function (err, status) {
      if (err != null)
        return sendError(res, err, status);

      model.update({
        _id: id
      }, {
        $set: set
      }, function (err) {
        if (err != null)
          return sendError(res, err);
        self.afterUpdate(req, {
          _id: id,
          set: set
        }, function () {
          res.end();
        });
      });

    });
  };

  routes['del:' + baseUrl + '/:id'] = function (req, res) {

    var id = req.param('id');

    self.beforeDelete(req, id, function (err) {
      if (err != null)
        return sendError(res, err);
      model.remove({
        _id: id
      }, function (err) {
        if (err != null)
          return sendError(res, err);
        self.afterDelete(req, id, function () {
          res.send({});
        });
      });

    });
  };

  Router.call(this, routes);
};

RESTRouter.prototype = Object.create(
  Router.prototype, {
    constructor: {
      value: RESTRouter
    }
  }
);

var methods = ['create', 'read', 'update', 'delete'];

function checkMethod(method) {
  if (methods.indexOf(method) == -1)
    throw new Error('Trying to hook a unknown method : ' + method);
}

RESTRouter.prototype.before = function (method, cb) {
  checkMethod(method);
  this['before' + capitalize(method)] = cb;
  return this;
};

RESTRouter.prototype.after = function (method, cb) {
  checkMethod(method);
  this['after' + capitalize(method)] = cb;
  return this;
};

RESTRouter.prototype.beforeCreate = function (req, data, cb) {
  cb(null, data);
};

RESTRouter.prototype.beforeRead = function (req, data, cb) {
  cb(null, data);
};

RESTRouter.prototype.beforeUpdate = function (req, data, cb) {
  cb();
};

RESTRouter.prototype.beforeDelete = function (req, data, cb) {
  cb();
};


RESTRouter.prototype.afterCreate = function (req, data, cb) {
  cb(null, {
    _id: data._id
  });
};

RESTRouter.prototype.afterRead = function (req, data, cb) {
  cb(null, data);
};

RESTRouter.prototype.afterUpdate = function (req, data, cb) {
  cb();
};

RESTRouter.prototype.afterDelete = function (req, data, cb) {
  cb();
};
