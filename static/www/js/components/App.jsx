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
	'components/PartyInfo',
	'components/Home',
	'components/Search',
	'components/Navbar',
	'components/ErrorDialog',
], function(
	React,
	$,
	Backbone,
	Router,
	BackboneMixin,
	Session,
	Party,
	Player,
	PartyInfo,
	HomeView,
	SearchView,
	Navbar,
	ErrorDialog
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
			var self = this;
			this.props.session.fetch({
        success: function () {
					if (self.props.session.get('party') == null) {
						partyExpired();
					} else {
						Backbone.history.start();
          }
        },
        error: function() {
					partyExpired();
        }
      });

      function partyExpired() {
				self.setState({
					error: [{type: 'critical', message: 'Your party has expired'}]
				});
      }

      window.app = this;
		},

		onUpdateCurrentPlayer: function (player) {
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

		render: function () {

			var session = this.props.session;
			var currentParty = session.get('party') || new Party();

			var dialog = [];

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
								onUpdateCurrentPlayer={this.onUpdateCurrentPlayer}
								onError={this.onPlayerError}/>
						</div>
					</div>
					<div class="contents">
						<div class="container main-contents">
							{main}
						</div>
					</div>
					<footer>
						<div class="container">
							<div class="pull-right">
								&copy; 2013 Tunesquared
							</div>
						</div>
					</footer>
					{dialog}
				</div>
			);
		}
	});

	return App;
});
