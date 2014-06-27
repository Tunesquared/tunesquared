/** @jsx React.DOM */
'use strict';

define(['react', 'jquery', 'utils', 'mixins/RouteState'],
  function(React, $, utils, RouteState){

	var Navbar = React.createClass({

    mixins: [RouteState],

		getInitialState: function() {
			return {
				showPlayer: false
			};
		},

		componentDidMount: function() {
			$(window).scroll(this.onScroll);
		},

		componentWillReceiveProps: function(props) {
			if(this.props.player != null) {
				this.props.player.off(null, null, this);
			}
			if (props.player != null)
				props.player.on('play pause stop', utils.forceUpdateFix(this), this);
		},

    onSearchSubmit: function(evt) {
      evt.preventDefault();

      var q = this.refs.search.state.value;

      window.location.hash = 'search/' + encodeURIComponent(q);
    },

		leave: function (evt) {
			evt.preventDefault();

			// We own this party so destroying it will make us leave cleanly
			this.props.session.get('party').destroy({
				success: function () {
					window.location.reload();
				}
			});
		},

		render: function(){

      var route = this.state.route;
      function activeOn(targetRoutes, isDefault) {

        if (isDefault && route === '') {
          return 'active';
        }

        for(var i in targetRoutes) {
          if (route.indexOf(targetRoutes[i]) === 0) {
            return 'active';
          }
        }

        return '';
      }

			return (
				<div class="navbar navbar-inverse navbar-fixed-top" id="navbar">
				  <a class="navbar-brand" href="#">Tune²</a>
          <ul class="nav navbar-nav nav-main">
            <li className={activeOn(['home', 'party'], true)} ><a href="#home">Home</a></li>
            <li className={activeOn(['music', 'search'])}><a href="#music">Music</a></li>
          </ul>
          <form class="navbar-form navbar-left" role="search" onSubmit={this.onSearchSubmit}>
            <div class="form-group">
              <input type="text" ref="search" class="form-control navbar-search-input" placeholder="Search" />
            </div>
          </form>
          <ul class="nav navbar-nav pull-right">
          	<li><a href="#" onClick={this.leave}>
          		<i class="icon-off"></i> exit</a>
          	</li>
          </ul>
        </div>
       );
		}
	});

	return Navbar;
});
