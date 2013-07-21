/** @jsx React.DOM */
'use strict';

define(['react', 'jquery', 'mixins/jqEvents', 'bootstrap/bootstrap-modal', 'wizard'], function(React, $, jqEvents){

	var CreateDialog = React.createClass({

		// The mixin allows declaration of jquery's plugin events listeners
		mixins: [jqEvents],
		jqEvents: {
			'wiz_done': 'onWizardComplete',
			'wiz_hide:0': 'onFirstPage',
			'wiz_trans:1-0': 'onBackToFirstPage'
		},

		// React component method

		componentDidMount: function(){
			this.node = $(this.getDOMNode()).modal({
				backdrop: 'static'
			})
			.wizard();
		},

		componentWillUnmount: function(){
			this.node.modal('hide');
		},

		getInitialState: function(){
			return {
				error: null
			};
		},

		// Custom methods

		onWizardComplete: function(){
			window.location.hash = this.props.redirect || '#';
		},

		onFirstPage: function(jqEvt, evt){
			var self = this;
			var name = this.refs.nameInput.getValue();
			this.setState({error: null});

			if(name === ''){
				this.setState({error:'You must provide a name'});
				evt.cancel();
			} else {
				var lock = evt.lock();
				this.props.session.createParty({name: name}, function (err /*, party */) {
					if(err != null){
						if(/duplicate key/.test(err)){
							this.setState({error: 'This name is currently used for another party'});
						}
						lock(true);
					} else {
						lock();
					}
				}.bind(this));
			}
		},

		onBackToFirstPage: function(jqEvt, evt){
			var lock = evt.lock();
			this.props.session.removeCurrentParty(function( err ){
				console.log(err);
				lock();
			});
		},

		onNameSubmit: function(evt){
			evt.preventDefault();
			$(this.getDOMNode()).wizard('next');
		},

		render: function(){
			return (
			<div class="modal fade" data-role="start-party" >
				<div class="modal-header">
					<h3>Start your party</h3>
				</div>
				<div class="modal-body">
					<div data-role="page">
						<form onSubmit={this.onNameSubmit}>
							<label class="control-label" for="party-name-input">Choose a cool name for your party :</label>
							<div class={'control-group '+(this.state.error != null ? 'error' : '')}>
								<div class="controls">
									<input type="text" id="party-name-input" ref="nameInput" />
									<span class="help-inline">{this.state.error}</span>
								</div>
							</div>
							<span class="help-block">Use something easy to remember so your guests can connect quickly to your party.</span>
						</form>
					</div>
					<div data-role="page">
						<div class="container-fluid">
							<div class="row-fluid">
								<div class="span12">
									<p>Your gusets can now access this party using one of the following method : </p>
								</div>
							</div>
							<div class="row-fluid">
								<div class="span5">
									<p>Let them scan this code</p>
									<img src="img/qr.jpg" />
								</div>
								<div class="span2">
									<p>OR</p>
								</div>
								<div class="span5">
									<p></p>
									<div class="mobile-prez">
										<p class="mobile-prez-text" data-role="mobile-text"></p>
										<img class="mobile-prez-image" src="img/mobile.png" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<img src="img/ajax-loader.gif" alt="loading" title="loading" data-role="loader"/>
					{/*<a href="#" class="btn" data-role="cancel" data-dismiss="modal">Cancel</a>*/}
					<a href="#" class="btn" data-role="prev" >Previous</a>
					<a href="#" class="btn btn-primary" data-role="done" >Done</a>
					<a href="#" class="btn btn-primary" data-role="next" >Next</a>
				</div>
			</div>
			);
		}
	});

	return CreateDialog;
});
