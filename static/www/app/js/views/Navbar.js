
define([
	"backbone",
	"text!templates/navbar.jst"],
function(
	Backbone,
	template
){
	
	var exports = Backbone.View.extend({
		template: template
	});

	return exports;
});