/* Main router.
 * 
 * Serves the desktop and mobile app's pages and preforms mobile browsers redirection if needed. 
 *
 */

var Framework = require('../framework');
 
module.exports = Framework.Router({

	// TODO : check mobile browser
	/* 
		If user is mobile, redirects to mobile site
	 	If user is already engaged in the app, serves the app
		Otherwise, serves the welcome page
		The welcome page is separated from the app so that it can be displayed fast
	*/
	'/': function(req, res){
		if(req.session.partyId){
			res.render('desktop');
		} else {
			res.render('welcome');
		}
	},

	'/party': function(req, res){
		res.render('desktop');
	},
	
	// Serves mobile app
   	'/m': function(req, res){
		res.render('mobile');
	}
});