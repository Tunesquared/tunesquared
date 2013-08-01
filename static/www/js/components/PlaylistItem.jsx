/** @jsx React.DOM */
'use strict';

define(['react'], function(React){
	var PlaylistItem = React.createClass({
		render: function () {
			return (
				<div class="song-container">
					<a class="pull-left" href="#"><i class="icon-trash"></i></a>
					<div class="vote-label negative">
						<div class="inner">- 0</div>
					</div>
					<div class="vote-label positive">
						<div class="inner">+ 0</div>
					</div>
					<div class="inner">
						# {this.props.pos} <strong>{this.props.song.get('title')}</strong> - {this.props.song.artist}
					</div>
				</div>
			);
		}
	});

	return PlaylistItem;
});
