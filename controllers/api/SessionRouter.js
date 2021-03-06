'use strict';

var Framework = require('../../framework');

var Party = require('../../models/Party');


module.exports = new Framework.Router({

  'api/session': function (req, res) {
    if (req.session.partyId) {

      Party.findOne({
        _id: req.session.partyId
      }, function (err, mod) {
        if (mod == null) {
          req.session.partyId = null;
          req.session.save(function() {
            res.send('No party with such id', 400);
          });
        } else {
          res.send({
            party: Party.mapVotes(mod.toObject(), req.session.votes),
            publickey: req.session.publickey,
            myParty: req.session.myParty
          });
        }
      });
    } else {
      res.send({
        party: null
      });
    }
  },

  'api/joinPartyByName/:name': function (req, res) {
    var name = req.param('name').toLowerCase();

    Party.findOne({
      name: name
    }, function (err, mod) {

      res.setHeader('Content-Type', 'application/json');
      if (err) {
        res.send(err, 400);
      } else if (mod === null) {
        res.send('Cannot find party ' + name, 400);
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
