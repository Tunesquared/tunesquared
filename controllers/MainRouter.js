'use strict';
/* Main router.
 *
 * Serves the desktop and mobile app's pages and preforms mobile browsers redirection if needed.
 *
 */

var Framework = require('../framework');

module.exports = new Framework.Router({

	// TODO : check mobile browser
	/*
		If user is mobile, redirects to mobile site
		If user is already engaged in the app, serves the app
		Otherwise, serves the welcome page
		The welcome page is separated from the app so that it can be displayed fast
	*/
	'/': function(req, res){
		if(req.session.myParty != null){
			res.render('desktop');
		} else {
			res.render('welcome');
		}
	}
});
