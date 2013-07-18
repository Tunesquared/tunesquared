'use strict';

// TODO : disable wizard and show loading during locked phase (in wizard source)

define([
	'underscore',
	'backbone',
	'text!templates/create.jst',
	'models/Session',
	'bootstrap/bootstrap-modal',
	'wizard'],
	function (_, Backbone, template, Session) {

		var exports = Backbone.View.extend({
			events: {
				'wiz_done': 'done',
				'wiz_hide:0': 'onFirstPage',
				'wiz_trans:1-0': 'onBackToFirstPage'
			},

			initialize: function () {
				this.template = template;

				_.bindAll(this, 'onFirstPage', 'onBackToFirstPage');

				// Renders the content at init time so that we can open the dialog later
				this.render();
			},

			postRender: function () {
				this.modal = this.$('.modal').modal({
					backdrop: 'static',
					show: false
				});
			},

			show: function () {
				this.modal.modal('show');
				this.modal.wizard();
				this.clearError();
			},

			hide: function () {
				this.modal.modal('hide');
			},

			done: function () {
				window.location.hash = '#';
			},

			// Triggered when user has chosen a name and wants to go to the next page of wizard
			onFirstPage: function (jqEvt, evt) {
				var self = this;
				var name = this.$ref('name-input').val();
				this.clearError();

				if(name === ''){
					self.setError('You must provide a name');
					evt.cancel();
				} else {
					var lock = evt.lock();
					Session.createParty({name: name}, function (err /*, party */) {
						if(err != null){
							if(/duplicate key/.test(err)){
								self.setError('This name is currently used for another party');
							}
							lock(true);
						} else {
							lock();
						}
					});
				}
			},

			// omg, user went back to the page where you have to pick a name
			onBackToFirstPage: function(jqEvt, evt){
				var lock = evt.lock();
				Session.removeCurrentParty(function( err ){
					console.log(err);
					lock();
				});
			},

			setError: function(err){
				this.$ref('err-text').text(err).show();
				this.$ref('control-group').addClass('error');
				this.$ref('name-input').focus().select();
			},

			clearError: function(){
				this.$ref('err-text').hide();
				this.$ref('control-group').removeClass('error');
			}

		});

		return exports;
	});
