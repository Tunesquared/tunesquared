/* Main router.
 * 
 * Serves the desktop and mobile app's pages and preforms mobile browsers redirection if needed. 
 *
 */

var Framework = require('../framework');
 
module.exports = Framework.Router({

	// Checks mobile and serves desktop app or redirects
	'/': function(req, res){
		res.render('desktop');
	}
	
	// Serves mobile app
    ,'/m': function(req, res){
		res.render('mobile');
	}
});