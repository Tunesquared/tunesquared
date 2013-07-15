define(['backbone', 'text!templates/create.jst', 'models/Session', 'models/PartyModel', 'bootstrap/bootstrap-modal', 'wizard'],
function(Backbone, template, Session, Party){
	
	var exports = Backbone.View.extend({
		events: {
			'wiz_done': 'done'
		},

		initialize: function(){
			this.template = template;

			// Renders the content at init time so that we can open the dialog later
			this.render();
		},

		postRender: function(){
			this.modal = this.$('.modal');
			this.nameInput = this.$('[data-role="party-name"]');
		},

		show: function(){
			this.modal.modal('show');
			this.modal.wizard();
		},

		hide: function(){
			this.modal.modal('hide');
		},

		done: function(){
			console.log("that's awesome");

			var name = this.nameInput.val();

			var myParty = new Party({name: name});
			myParty.save(void 0, {
				success: function(){
					console.log("created");
					// TODO : set party in session, party has a method to know if owner
					window.location.hash = '#';
				},
				error: function(){
					console.log("Error !");
					// TODO : display error
				}
			})
		}

	});

	return exports;
});