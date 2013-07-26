'use strict';

/* TODO change middleware syntax from RESTController(foo, { before: function(req, method, data, res)})
  to myController.before('create', function(){}); */

var router = require('./Router');


function sendError(res, err, status) {
  res.statusCode = status || 400;
  if(err.name === 'MongoError')
    res.send(err.err);
  else if (err.name === 'ValidationError')
    res.send(JSON.stringify(err.errors));
  else
    res.send(err);
}

var RESTRouter = module.exports = function (model, baseUrl, options) {
  options = options || {};

  var before = options.before || defaultBefore;
  var after = options.after || defaultAfter;

  var routes = {};

  routes['post:' + baseUrl] = function (req, res) {

    var data = req.body;

    before(req, 'create', data, function (err, data) {
      if (err != null)
        return sendError(res, err, data);
      model.create(data, function (err, mod) {
        if (err != null){
          console.log(JSON.stringify(err));
          return sendError(res, err);
        }
        after(req, 'create', mod, function (err, data) {
          if (err != null)
            return sendError(res, err, data);

          res.send(data);
        });
      });

    });
  };

  routes[baseUrl] = function (req, res) {
    before(req, 'read', null, function (err, data) {
      if (err != null)
        return sendError(err, data);

      model.find({}, function (err, coll) {
        if (err != null)
          return sendError(res, err);

        after(req, 'read', coll, function (err, data) {
          if (err != null)
            return sendError(res, err, data);
          res.send(data);
        });
      });
    });
  };

  routes[baseUrl + '/:id'] = function (req, res) {

    var id = req.param('id');

    before(req, 'read', id, function (err, data) {
      if (err != null)
        return sendError(res, err, data);

      model.findOne({
        _id: id
      }, function (err, mod) {
        if (err != null)
          return sendError(res, err);
        after(req, 'read', mod, function (err, data) {
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

    before(req, 'update', {
      _id: id,
      set: set
    }, function (err, status) {
      if (err != null)
        return sendError(res, err, status);

      model.update({_id: id}, {
        $set: set
      }, function (err) {
        if (err != null)
          return sendError(res, err);
        after(req, 'update', {
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

    before(req, 'delete', id, function (err) {
      if (err != null)
        return sendError(res, err);
      model.remove({
        _id: id
      }, function (err) {
        if (err != null)
          return sendError(res, err);
        after(req, 'delete', id, function () {
          res.send({});
        });
      });

    });
  };

  return router(routes);
};

var defaultBefore = RESTRouter.defaultBefore = function(req, method, data, cb) {
  switch (method) {
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
}

var defaultAfter = RESTRouter.defaultAfter = function(req, method, data, cb) {
  switch (method) {
  case 'create':
    cb(null, {
      _id: data._id
    });
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
}
