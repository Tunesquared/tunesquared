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

		leave: function (evt) {
			evt.preventDefault();

			// We own this party so destroying it will make us leave cleanly
			this.props.session.get('party').destroy({
				success: function () {
					console.log('test');
					window.location.reload();
				}
			});
		},

		render: function(){

      var route = this.state.route;
      function activeOn(targetRoute) {
        return (route === targetRoute) ? 'active' : '';
      }

			return (
				<div class="navbar navbar-inverse navbar-fixed-top" id="navbar">
				  <a class="navbar-brand" href="#">Tune²</a>
          <ul class="nav navbar-nav nav-main">
            <li className={activeOn('')} ><a href="#">Party</a></li>
            <li className={activeOn('playlist')}><a href="#playlist">Playlist</a></li>
            <li className={activeOn('music')}><a href="#music">Explore</a></li>
          </ul>
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
