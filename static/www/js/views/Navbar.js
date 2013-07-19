'use strict';

define([
	'backbone',
	'text!templates/navbar.jst'],
function(
	Backbone,
	template
){

	var exports = Backbone.View.extend({
		template: template,
		initialize: function(){
			this.render();
		}
	});

	return exports;
});
