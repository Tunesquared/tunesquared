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
					<div class="pull-left" href="#">
						<img class="media-object" src={song.get('thumb')} />
					</div>
					<div class="media-body">
						<h4 class="media-heading">{song.get('title')}</h4>
						<h4><span class="label label-success"><i class="icon-thumbs-up"></i>{' '+song.get('votes_yes')}</span>
						<br />
						<span class="label label-danger"><i class="icon-thumbs-down"></i>{' '+song.get('votes_no')}</span>
						</h4>
					</div>
				</div>
			);
		}
	});

	return PlaylistItem;
});
