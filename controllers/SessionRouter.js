'use strict';

var Framework = require('../framework');
var guid = require('../framework/lib/utils').guid;

var Party = require('../models/Party');


// Ensures the client has a properly populated session
// TODO : hook this piece of middleware in express's stack

function prepareSession(sess, cb) {
    if (!sess.publickey) {
        sess.publickey = guid();
        sess.save(cb);
    } else {
        cb();
    }
}

module.exports = Framework.Router({

    'api/session': function (req, res) {
        prepareSession(req.session, function () {
            if (req.session.partyId) {

                Party.findOne({
                    _id: req.session.partyId
                }, function (err, mod) {

                    res.send({
                        party: mod,
                        publickey: req.session.publickey
                    });

                });
            } else {
                res.send({
                    party: null
                });
            }
        });
    },

    'api/joinPartyByName/:name': function (req, res) {
        var name = req.param('name');
        console.log(name);

        Party.findOne({
            name: name
        }, function (err, mod) {

            res.setHeader('Content-Type', 'application/json');
            if (err) {
                res.send('{"error": "' + err + '"}');
            } else if (mod === null) {
                res.send(JSON.stringify({
                    error: 'Cannot find party ' + name
                }));
            } else {

                req.session.partyId = mod._id;

                req.session.save(function () {
                    res.send(mod);
                });
            }
        });
    },

    'api/leaveParty': function (req, res) {

        req.session.partyId = null;

        req.session.save(function () {
            res.end();
        });
    }
});
