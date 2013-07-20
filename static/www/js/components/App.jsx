/** @jsx React.DOM */
'use strict';

define([
	'react',
	'backbone',
	'mixins/Router',
	'models/Session',
	'components/CreateDialog',
	'components/Playlist',
	'components/Home'
], function(
	React,
	Backbone,
	Router,
	Session,
	CreateDialog,
	Playlist,
	HomeView
){

	var App = React.createClass({

		mixins: [Router],

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

			'': function () {
				this.setState({
					dialog: null,
					main: 'home'
				});
			}
		},

		componentDidMount: function(){
			Backbone.history.start();
			// TODO : not make session a global but some app's attribute instead
			/*Session.fetch({
        success: function () {
          Backbone.history.start();
        }
      });*/
		},

		render: function () {
			var dialog;
			if (this.state.dialog === 'create')
				dialog = <CreateDialog session={Session} />;

			var main;
			if (this.state.main === 'home')
				main = <HomeView />;


			return (
				<div>
					<div id="side-panel">
						<div id="player"></div>
						<Playlist />
		        <div id="party-info"></div>
					</div>
	        <div id="main-panel">
	            <div id="navbar"></div>
	            <div id="main-contents">{main}</div>
	        </div>
	        {dialog}
	      </div>
      );
		}
	});

	return App;
});
