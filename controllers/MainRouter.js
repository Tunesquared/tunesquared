'use strict';
/* Main router.
 *
 * Serves the desktop and mobile app's pages and preforms mobile browsers redirection if needed.
 *
 */

var Framework = require('../framework');

var Party = require('../models/Party');

var mUtils = require('../utils/mobileUtils');


module.exports = new Framework.Router({

	// TODO : check mobile browser
	/*
		If user is mobile, redirects to mobile site
		If user is already engaged in the app, serves the app
		Otherwise, serves the welcome page
		The welcome page is separated from the app so that it can be displayed fast
	*/
	'/': function(req, res){
		if (mUtils.isMobile(req)) {
			res.redirect('/m');
		} else {
			if(req.session.myParty != null){
				Party.findOne({
		      _id: req.session.partyId
			    }, function (err, mod) {
						if (mod != null)
							res.render('desktop');
						else {
							req.session.myParty = null;
							req.session.partyId = null;
							req.session.save();
							res.render('welcome');
						}
					});
			} else {
				res.render('welcome');
			}
		}
	},

	'/desktop': function(req, res) {
		mUtils.forceDesktop(res);
		res.redirect('/');
	},

	'/m': function(req, res, next) {
		mUtils.clearForce(req, res);
		next();
	}
});
