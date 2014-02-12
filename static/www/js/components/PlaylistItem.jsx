/** @jsx React.DOM */
'use strict';

define(['react', 'mixins/Backbone'], function(React, BackboneMixin){
	var PlaylistItem = React.createClass({
		mixins: [BackboneMixin],

		getBackboneModels: function () {
			return [this.props.song];
		},

		onDestroy: function (evt) {
			evt.preventDefault();
			this.props.song.destroy();
		},

		render: function () {
			var song = this.props.song.toJSON();
			return (
				<div onClick={this.onClick} class="song-vignette">
					<a class="song-remove" onClick={this.onDestroy} href="#">
						<i class="icon-remove"></i>
					</a>
					<div class="song-thumb">
						<img src={song.thumb} />
					</div>
					<div class="song-title">
						{song.title}
					</div>
				</div>
			);
		}
	});

	return PlaylistItem;
});
