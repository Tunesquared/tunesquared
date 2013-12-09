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
			var song = this.props.song;
			return (
				<div class="playlist-item" key={song.cid} >
					<a class="remove-btn" href="#" onClick={this.onDestroy}><i class="icon-trash"></i></a>
					<img src={song.get('thumb')} />
					<h4>{song.get('title')}</h4>
					<span class="label label-success"><i class="icon-thumbs-up"></i>{' '+song.get('votes_yes')}</span>
					<span class="label label-danger"><i class="icon-thumbs-down"></i>{' '+song.get('votes_no')}</span>
				</div>
			);
		}
	});

	return PlaylistItem;
});
