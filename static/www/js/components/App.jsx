/** @jsx React.DOM */
'use strict';

define([
	'react',
	'jquery',
	'backbone',
	'mixins/Router',
	'mixins/Backbone',
	'models/Session',
	'models/Party',
	'components/Player',
	'components/Playlist',
	'components/PartyInfo',
	'components/Home',
	'components/Search',
	'components/Navbar',
	'components/ErrorDialog',
	'components/QRCode',
	'bootstrap/affix'
], function(
	React,
	$,
	Backbone,
	Router,
	BackboneMixin,
	Session,
	Party,
	Player,
	Playlist,
	PartyInfo,
	HomeView,
	SearchView,
	Navbar,
	ErrorDialog,
	QRCode
){

	var App = React.createClass({

		mixins: [Router, BackboneMixin],

		getInitialState: function(){
			return {
				dialog: null,
				main: 'home'/*,
				currentPlayer: null*/
			};
		},

		routes: {
			'search/:q': function (q) {
				this.setState({
					dialog: null,
					main: 'search',
					query: decodeURIComponent(q)
				});
			},

			'': function () {
				this.setState({
					dialog: null,
					main: 'home'
				});
			}
		},

		getBackboneModels: function () {
			return [this.props.session];
		},

		componentDidMount: function(){
			this.props.session.fetch({
        success: function () {
          Backbone.history.start();
        }
      });

      window.app = this;
		},

		componentDidUpdate: function () {
			var affix = $(this.refs.affix.getDOMNode());
			/*affix.affix({
		    offset: {
		      top: affix.offset().top
		    , bottom: function () {
						// Footer height to stop the affix at page bottom
		        return 0;//(this.bottom = $('.bs-footer').outerHeight(true))
		      }
		    }
		  });*/
		},

		onNewCurrentPlayer: function (player) {
			this.setState({
				currentPlayer: player
			});
		},

		onPlayerError: function (errs){
			var errors = [];
			errs.forEach(function(err){
				errors.push ({
					type : err.type,
					message : err.err
				});
			});
			this.setState({
				error : errors
			});
		},

		toggleQRCodeShow: function() {
			var qrelement = $(this.refs['qrcode-container'].getDOMNode());
			var qrActionElement = $(this.refs.qraction.getDOMNode());

			if(qrelement.is(':hidden')) {
				qrelement.show(500);
				qrActionElement.text(" Hide");
			}
			else {
				qrelement.hide(500);
				qrActionElement.text(" Show");
			}
		},

		render: function () {

			var session = this.props.session;
			var currentParty = session.get('party') || new Party();

			var dialog = [];

			var QRCodeURL =
				'http://'
				+ window.location.host
				+ '/party/'
				+ encodeURIComponent(currentParty.get('name'));

			var main;
			if (this.state.main === 'home')
				main = <HomeView party={currentParty} />;
			else if(this.state.main === 'search')
				main = <SearchView party={currentParty} query={this.state.query} />

			if (this.state.error)
				this.state.error.forEach(function(error){
				dialog.push (<ErrorDialog type={error.type} message={error.message} />);
			});

			return (
				<div>
					<Navbar session={ session } player={this.state.currentPlayer} />
					<div class="top">
						<div class="container">
							<Player
								party={ currentParty }
								onNewCurrentPlayer={this.onNewCurrentPlayer}
								onError={this.onPlayerError}/>
						</div>
					</div>
					<div class="contents">


						<div class="container">
							<div class="col-4" ><br />
								<div ref="qrcode-container" class="panel">
									<div>
										<button onClick={this.toggleQRCodeShow} class="qr-toogleshow btn icon-qrcode">
											<span ref="qraction"> Show</span> QR code
										</button>
							 			<br />
									</div>
									<div class="qrcode-container" ref="qrcode-container">
										<QRCode data={ QRCodeURL} />
									</div>
								</div>
								<div ref="affix">
									<Playlist party={currentParty}/>
								</div>
							</div>
							<div class="col-8 main-contents">
								{main}
							</div>
						</div>
					</div>
					<footer>
						<div class="container">
							Blabla
						</div>
					</footer>
					{dialog}
				</div>
			);
		}
	});

	return App;
});
