'use strict';

define(['underscore', 'backbone', 'text!templates/create.jst', 'models/Session', 'models/PartyModel', 'bootstrap/bootstrap-modal', 'wizard'],
	function (_, Backbone, template, Session, Party) {

		var exports = Backbone.View.extend({
			events: {
				'wiz_done': 'done',
				'wiz_hide:0': 'onFirstPage'
			},

			initialize: function () {
				this.template = template;

				_.bindAll(this, 'onFirstPage');

				// Renders the content at init time so that we can open the dialog later
				this.render();
			},

			postRender: function () {
				this.modal = this.$('.modal').modal({
					backdrop: 'static',
					show: false
				});
				this.nameInput = this.$('[data-role="party-name"]');
			},

			show: function () {
				this.modal.modal('show');
				this.modal.wizard();
			},

			hide: function () {
				this.modal.modal('hide');
			},

			done: function () {
				var name = this.nameInput.val();

				var myParty = new Party({
					name: name
				});
				myParty.save(void 0, {
					success: function () {
						console.log('created');
						// TODO : set party in session, party has a method to know if owner
						window.location.hash = '#';
					},
					error: function () {
						console.log('Error !');
						// TODO : display error
					}
				});
			},

			onFirstPage: function (evt, wiz) {
				console.log(evt.originalEvent);
				var lock = wiz.lock();
				// TODO : use a create party method instead. When party is successfully created
				// lock wizzard to not go backwards.
				// TODO : add some functionnality in wizard to remove one page (wizard is behaving like this page is not here)
				Party.getByName(this.nameInput.val(), function (party) {
					if (party == null) {
						lock(true);
						return;
					}
					lock();
				});
			}

		});

		return exports;
	});
