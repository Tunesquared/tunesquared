var Framework = require('../framework');

module.exports = Framework.Router({

	'api/party/getByName/:name': function(req, res){
        var name = req.param('name');
        res.send('{"_id": "1234", "name": "'+name+'"}');
	}
});