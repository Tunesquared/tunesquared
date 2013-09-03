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
			var className = "media list-group-item playlist-item" + (this.props.isNext ? " active" : "");
			var title = (this.props.isNext) ? <h3>Next :</h3> : '';
			return (
				<a class={className} key={song.cid} >
					{title}
					<span class="remove-btn" href="#" onClick={this.onDestroy}><i class="icon-remove"></i></span>
					<div class="pull-left" href="#">
						<img class="media-object" src={song.get('thumb')} />
					</div>
					<div class="media-body">
						<h4 class="media-heading">{song.get('title')}</h4>
						<h4><span class="label label-success"><i class="icon-thumbs-up"></i>{' '+song.get('votes_yes')}</span>
						{' '}
						<span class="label label-danger"><i class="icon-thumbs-down"></i>{' '+song.get('votes_no')}</span>
						</h4>
					</div>
				</a>
			);
		}
	});

	return PlaylistItem;
});
