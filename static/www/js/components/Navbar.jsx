/** @jsx React.DOM */
'use strict';

define(['react', 'jquery', 'utils'], function(React, $, utils){

	var Navbar = React.createClass({

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

		onSearch: function (evt) {
			evt.preventDefault();
			window.location.href = '#search/'+encodeURIComponent(this.refs.search.getValue());
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

		onPlay: function (evt) {
      evt.preventDefault();
      if(this.props.player);
        this.props.player.play();
    },

    onPause: function (evt) {
      evt.preventDefault();
      if(this.props.player);
        this.props.player.pause();
    },

    onSkip: function(evt){
      evt.preventDefault();
      // We cheat a little on this one but anyways, if it works...
      if(this.props.player)
        this.props.player.trigger('end');
    },

    onScroll: function() {
			var player = $('#player');
			var navbar = $('#navbar');
			var isHidden = player.offset().top + player.height() < navbar.offset().top + navbar.height();

			if (isHidden && this.state.showPlayer === false) {
				this.setState({
					showPlayer: true
				});
			} else if (!isHidden && this.state.showPlayer === true) {
				this.setState({
					showPlayer: false
				});
			}
		},

		render: function(){

			var playerControls = '';

			if (this.props.player != null && this.state.showPlayer === true){
				playerControls = [
					(this.props.player.getState() === 'playing') ?
						<a class="btn btn-primary" onClick={this.onPause} key={'play'}><i class="icon-pause"></i></a>
					: <a class="btn btn-primary" onClick={this.onPlay} key={'play'}><i class="icon-play"></i></a>,
					<a class="btn btn-default" onClick={this.onSkip} key={'pause'}><i class="icon-fast-forward"></i></a>
				];
			}

			return (
				<div class="navbar navbar-inverse navbar-fixed-top" id="navbar">
					<div class="container">
						<div class="row">
						<div class="col-1">
					  <a class="navbar-brand" href="#">Tune²</a>
					  </div>

            <div class="col-4">
            <form class="form-inline" action="" onSubmit={this.onSearch}>
              <input type="text" id="search-field" class="form-control navbar-search" placeholder="Search" ref="search"/>
            </form>
            </div>
            <div class="col-5 navbar-player">
            	{playerControls}
            </div>
            <div class="col-2">
            <ul class="nav navbar-nav pull-right">
            	<li><a href="#" onClick={this.leave}>
            		<i class="icon-off"></i> exit</a>
            	</li>
            </ul>
            </div>
            </div>
				  </div>
        </div>
       );
		}
	});

	return Navbar;
});
