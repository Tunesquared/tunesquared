/** @jsx React.DOM */
'use strict';

define(['react', 'jquery', 'mixins/jqEvents'/*, TODO :'json'*/, 'bootstrap/bootstrap-modal', 'wizard'],
	function(React, $, jqEvents/*, JSON*/){

	/* Maximum string length for party title. (see Party server model) */
	var PARTY_TITLE_MAX_LEN = 32;

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
			this.node = $(this.getDOMNode()).modal()
			.on('hide', this.props.onHide)
			.wizard();
		},

		componentWillUnmount: function(){
			//this.node.modal('hide');
		},

		getInitialState: function(){
			return {
				error: null
			};
		},

		// Custom methods

		onWizardComplete: function(){
			this.node.modal('hide');
			// TODO : show an ajax-loader because location.reload may not be instantaneous over internet
			window.location.reload();
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
						// Performs some checks to be sure what error we are talking about
						try {
							err = JSON.parse(err);
						} catch (e) {	}

						if (err == 'already owns a party'){
							this.setState({error: 'You already own a party, you must delete it first.'});
						} else if(err.name && /"String is not in range" failed for path name/.test(err.name.message)) {
							this.setState({error: 'This name is too long. ('+PARTY_TITLE_MAX_LEN+' character max)'});
						} else if(/duplicate key/.test(err)){
							this.setState({error: 'This name is currently used for another party'});
						} else {
							this.setState({error: 'Something went wrong'});
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
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
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
					<a href="#" class="btn" data-role="cancel" data-dismiss="modal">Cancel</a>
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
