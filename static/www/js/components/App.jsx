/** @jsx React.DOM */
'use strict';

define([
	'react',
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
	'components/Navbar'
], function(
	React,
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
	Navbar
){

	var App = React.createClass({

		mixins: [Router, BackboneMixin],

		getInitialState: function(){
			return {
				dialog: null,
				main: 'home'
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
		},

		componentDidUpdate: function () {
			console.log('[info] App component updated');
		},

		render: function () {

			var session = this.props.session;
			var currentParty = session.get('party') || new Party();

			var dialog;

			var main;
			if (this.state.main === 'home')
				main = <HomeView />;
			else if(this.state.main === 'search')
				main = <SearchView party={currentParty} query={this.state.query} />


			return (
				<div>
					<Navbar session={ session } />
					<div class="top">
						<div class="container">
							<Player party={ currentParty } />
						</div>
					</div>
					<div class="contents">
						<div class="container">
							<div class="col-4">
								<Playlist playlist={currentParty.get('playlist')}/>
							</div>
							<div class="col-8 main-contents">
								{main}
							</div>
						</div>
					</div>
	        {dialog}
	      </div>
      );
		}
	});

	return App;
});
