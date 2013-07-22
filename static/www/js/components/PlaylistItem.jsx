/** @jsx React.DOM */
'use strict';

define(['react'], function(React){
	var PlaylistItem = React.createClass({
		render: function () {
			return (
				<div class="song-container">
					<div class="vote-label negative">
						<div class="inner">- voteMinus</div>
					</div>
					<div class="vote-label positive">
						<div class="inner">+ votePlus</div>
					</div>
					<div class="inner">
						# position <strong>title</strong> - artist
					</div>
				</div>
			);
		}
	});

	return PlaylistItem;
});
