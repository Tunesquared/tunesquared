'use strict';

/* Mixin for implementing a backbone based router in a react component.

	example:
	React.createClass({
		mixins: [Router],
		routes: {
			'search/:q': function (q) {
				this.setState({
					page: 'search',
					searchQuery: q
				});
			},
			'': function () {
				this.setState({
					page: 'home'
				});
			}
		}
		...

		note: you still need to start Backbone's history somewhere
 */

define(['backbone', 'underscore'], function(Backbone, _){
	var Router = {
		componentDidMount: function(){
			this.router = new Backbone.Router;

			for(var i in this.routes){
				this.routes[i] = _.bind(this.routes[i], this);
				this.router.route(i, i, this.routes[i]);
			}
		}
	};
	return Router;
});
