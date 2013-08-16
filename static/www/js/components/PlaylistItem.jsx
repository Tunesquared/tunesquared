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
					<a class="pull-left" href="#" onClick={this.onDestroy}><i class="icon-trash"></i></a>
					{' # ' + this.props.pos} <strong>{song.get('title')}</strong>, {song.artist}
					{'[ - ' +	song.get('votes_no') + ' ; ' + song.get('votes_yes') + ' ]'}
				</div>
			);
		}
	});

	return PlaylistItem;
});
