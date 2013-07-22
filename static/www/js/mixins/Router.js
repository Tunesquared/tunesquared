'use strict';

define(['backbone', 'underscore'], function(Backbone, _){
	var Router = {
		componentDidMount: function(){
			for(var i in this.routes){
				this.routes[i] = _.bind(this.routes[i], this);
			}

			new (Backbone.Router.extend({
				routes: this.routes
			}))();
		}
	};
	return Router;
});
