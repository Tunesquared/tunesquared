'use strict';

define(['backbone', 'text!templates/playlist.jst', 'models/Session'], function (Backbone, template, Session) {
	var PlaylistView = Backbone.View.extend({
		template: template,
		initalize: function(){
			this.collection = Session.get('party').get('playlist');

			Session.on('change:party', function(){
				this.collection = Session.get('party').get('playlist');
			}.bind(this));

			this.render();
		}
	});

	return PlaylistView;
});
