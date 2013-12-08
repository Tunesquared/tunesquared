/** @jsx React.DOM */
'use strict';

define(['react', 'jquery', 'mixins/jqEvents', 'components/QRCode'/*, TODO :'json'*/, 'bootstrap/modal', 'wizard'],
	function(React, $, jqEvents, QRCode /*, JSON*/){

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
			this.node = $(this.getDOMNode()).modal('show')
			.on('hide.bs.modal', this.onHide)
			.wizard();
		},

		componentWillUnmount: function(){
			this.node.modal('hide');
		},

		getInitialState: function(){
			return {
				error: null,
				partyName: ''
			};
		},

		// Custom methods

		onHide: function() {
			var onHide = this.props.onHide;
			// Defers callback call to avoid scrollbar issue
			window.setTimeout(function(){
				onHide();
			});
		},

		onWizardComplete: function(){
			this.node.modal('hide');
			// TODO : show an ajax-loader because location.reload may not be instantaneous over internet
			window.location.reload();
		},

		onFirstPage: function(jqEvt, evt){
			var self = this;
			var name = this.state.nameInputValue;
			this.setState({error: null});

			if(name === ''){
				this.setState({error:'You must provide a name'});
				evt.cancel();
			} else {
				// Pauses wizard page transition, showing a loading
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

						// Cancels wizard transition
						lock(true);
					} else {

						this.setState({
							partyName: name
						});

						// Resumes wizard transition
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

		onNameInputChange: function(e) {
			this.setState({nameInputValue: e.target.value});
		},

		render: function(){
			return (
			<div className="modal fade" >
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
							<h4 className="modal-title">Start your party</h4>
						</div>
						<div className="modal-body">
							<div data-role="page">
								<form onSubmit={this.onNameSubmit}>
									<label className="control-label" for="party-name-input">Choose a cool name for your party :</label>
									<div className={'control-group '+(this.state.error != null ? 'text-danger' : '')}>
										<div className="controls">
											<input type="text" id="party-name-input" className="form-control" ref="nameInput"
												value={this.state.nameInputValue} onChange={this.onNameInputChange}/>
											<span className="help-inline">{this.state.error}</span>
										</div>
									</div>
									<span className="help-block">Use something easy to remember so your guests can connect quickly to your party.</span>
								</form>
							</div>
							<div data-role="page">
								<div className="container-fluid">
									<div className="row-fluid">
										<div className="col-12">
											<p>Your guests can now access this party using one of the following method:</p>
										</div>
									</div>
									<div className="row">
										<div className="col-5">
											<p>Let them scan this code</p>
											<QRCode data={'http://' + window.location.host + '/party/' + encodeURIComponent(this.state.partyName)} />
										</div>
										<div className="col-2">
											<p>OR</p>
										</div>
										<div className="col-5">
											<p></p>
											<div className="mobile-prez">
												<p className="mobile-prez-text" data-role="mobile-text"></p>
												<img className="img-responsive" src="img/mobile.png" />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<img src="img/ajax-loader.gif" alt="loading" title="loading" data-role="loader"/>
							<button type="button" className="btn btn-default" data-role="cancel" data-dismiss="modal">Cancel</button>
							<button type="button" className="btn btn-default" data-role="prev" >Previous</button>
							<button type="button" className="btn btn-primary" data-role="done" >Done</button>
							<button type="button" className="btn btn-primary" data-role="next" >Next</button>
						</div>
					</div>
				</div>
			</div>
			);
		}
	});

	return CreateDialog;
});
