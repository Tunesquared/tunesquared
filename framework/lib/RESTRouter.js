'use strict';

var router = require('./Router');


function sendError(res, err, status){
    res.statusCode = status || 400;
    res.send(err);
}

module.exports = function (model, baseUrl) {

    var routes = {};

    routes['post:' + baseUrl] = function (req, res) {
        console.log('create ' + baseUrl);

        var data = req.body;

        model.before(req, 'create', data, function (err, data) {
            if(err != null)
                return sendError(res, err, data);

            model.model.create(data, function (err, mod) {
                if(err != null)
                    return sendError(res, err.err);

                model.after(req, 'create', mod, function (err, data) {
                    if(err != null)
                        return sendError(res, err, data);

                    res.send(data);
                });
            });

        });
    };

    routes[baseUrl] = function (req, res) {
        model.before(req, 'read', null, function (err, data) {
            if(err != null)
                return sendError(err, data);

            model.model.find({}, function (err, coll) {
                if(err != null)
                    return sendError(res, err.err);

                model.after(req, 'read', coll, function (err, data) {
                    if(err != null)
                        return sendError(res, err, data);
                    res.send(data);
                });
            });
        });
    };

    routes[baseUrl + '/:id'] = function (req, res) {
        res.send('read');

        var id = req.param('id');

        model.before(req, 'read', id, function (err, data) {
            if(err != null)
                return sendError(res, err, data);

            model.model.findOne({
                _id: id
            }, function (err, mod) {
                if(err != null)
                    return sendError(res, err.err);
                model.after(req, 'read', mod, function (err, data) {
                    if(err != null)
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

        model.before(req, 'update', {
            _id: id,
            set: set
        }, function (err, data) {
            if(err != null)
                return sendError(res, err, data);

            model.model.findByIdAndUpdate(data._id, {
                $set: data.set
            }, function (err, mod) {
                if(err != null)
                    return sendError(res, err.err);
                model.after(req, 'update', {
                    _id: id,
                    set: set
                }, function () {
                    res.end();
                });
            });

        });
    };

    routes['del:' + baseUrl + '/:id'] = function (req, res) {
        res.send('deleted');

        var id = req.param('id');

        model.before(req, 'delete', id, function (err) {
            if(err != null)
                return sendError(res, err);
            model.model.remove({
                _id: id
            }, function (err, mod) {
                if(err != null)
                    return sendError(res, err.err);
                model.after(req, 'delete', id, function () {
                    res.end();
                });
            });

        });
    };

    return router(routes);
};
