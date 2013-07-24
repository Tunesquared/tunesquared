/** @jsx React.DOM */
'use strict';

define([
	'react',
	'backbone',
	'mixins/Router',
	'mixins/Backbone',
	'models/Session',
	'models/Party',
	'components/CreateDialog',
	'components/Playlist',
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
	CreateDialog,
	Playlist,
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
			'create': function () {
				this.setState({
					dialog: 'create'
				});
			},

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
			return [Session];
		},

		componentDidMount: function(){
			// TODO : not make session a global but some app's attribute instead
			Session.fetch({
        success: function () {
          Backbone.history.start();
        }
      });
		},

		componentDidUpdate: function () {
			console.log('[info] App component updated');
		},

		render: function () {

			var currentParty = Session.get('party') || new Party();

			var dialog;
			if (this.state.dialog === 'create')
				dialog = <CreateDialog session={Session} />;

			var main;
			if (this.state.main === 'home')
				main = <HomeView />;
			else if(this.state.main === 'search')
				main = <SearchView party={currentParty} query={this.state.query} />


			return (
				<div>
					<div id="side-panel">
						<div id="player"></div>
						<Playlist playlist={currentParty.get('playlist')}/>
		        <div id="party-info"></div>
					</div>
	        <div id="main-panel">
	            <Navbar />
	            <div id="main-contents">{main}</div>
	        </div>
	        {dialog}
	      </div>
      );
		}
	});

	return App;
});
