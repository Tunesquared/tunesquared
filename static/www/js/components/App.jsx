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
	'components/QRCode',
	'components/Playlist',
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
	ErrorDialog,
	QRCode,
	Playlist
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
				mixpanel.track('search', {
					party_id: this.props.session.get('party').id,
					q: q,
					platform: 'desktop'
				});
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

		componentWillReceiveProps: function(props) {
      this.updateQRCodeURL(props.party);
    },

    updateQRCodeURL: function(party) {
      party = party || this.props.session.get('party');
      this.setState({
        QRCodeURL: 'http://' +
          window.location.host +
          '/party/' +
          encodeURIComponent(party.get('name'))
      });
    },

		getBackboneModels: function () {
			return [this.props.session];
		},

		updateSessionRefs: function() {
			var session = this.props.session;

			if (this.party) {
				this.party.off(null, null, this);
			}

			this.party = session.get('party');
			this.party.on('change sync', this.updateQRCodeURL, this);

			this.updateQRCodeURL();
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
			this.props.session.on('sync', this.updateSessionRefs, this);

      function partyExpired() {
				self.setState({
					error: [{type: 'critical', message: 'Your party has expired'}]
				});
      }

      window.app = this;
		},

		onUpdateCurrentPlayer: function (player) {
			if (player != null && this.props.session.get('party') != null) {
				mixpanel.track('song played', {
					party_id: this.props.session.get('party').id,
					song_title: player.song.get('title')
				});
			}
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
							<div class="row">
								<div class="col-4 side-column">
									<h3 class="side-title">Scan to vote!</h3>
			            <QRCode data={this.state.QRCodeURL} />
			            <div class="col-12">
				            <Playlist playlist={currentParty.get('playlist')} />
				          </div>
			          </div>
			          <div class="col-8">
								{main}
								</div>
							</div>
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
