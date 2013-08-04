/** @jsx React.DOM */
'use strict';

define(['react'], function(React){
	var PlaylistItem = React.createClass({

		onDestroy: function (evt) {
			evt.preventDefault();
			this.props.song.destroy();
		},

		render: function () {
			var song = this.props.song;

			return (
				<div class="song-container">
					<a class="pull-left" href="#" onClick={this.onDestroy}><i class="icon-trash"></i></a>
					<div class="vote-label negative">
						<div class="inner">- {song.get('votes_no')}</div>
					</div>
					<div class="vote-label positive">
						<div class="inner">+ {song.get('votes_yes')}</div>
					</div>
					<div class="inner">
						# {this.props.pos} <strong>{song.get('title')}</strong> - {song.artist}
					</div>
				</div>
			);
		}
	});

	return PlaylistItem;
});
