
define([
	"backbone",
	"text!templates/home.jst"],
function(
	Backbone,
	template
){
	
	var exports = Backbone.View.extend({
		template: template
	});

	return exports;
});