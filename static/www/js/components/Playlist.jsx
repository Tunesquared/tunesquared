/** @jsx React.DOM */
'use strict';

define(['react', 'components/PlaylistItem', 'utils'], function(React, PlaylistItem, utils){

	var ITEMS_N = 5; // Number of playlist item shown

	var Playlist = React.createClass({
		componentDidUpdate: function () {
		},

		componentDidMount: function () {
			this.props.playlist.on('add remove change sort', utils.forceUpdateFix(this), this);
		},

		componentWillUnmount: function() {
			if(this.props.playlist)
				this.props.playlist.off(null, null, this);
		},

		componentWillReceiveProps: function (newProps) {
			if(this.props.playlist)
				this.props.playlist.off(null, null, this);
			newProps.playlist.on('add remove change sort', utils.forceUpdateFix(this), this);
		},

		render: function () {
			var i = 0;
			var list = this.props.playlist.map(function(song){
				return <PlaylistItem
						pos={++i}
						song={song}

						// We need to add spice to the key otherwise react fails to detect change
						key={song.cid + song.get('votes_yes') + song.get('votes_no')} />
			});

			var isEmpty = this.props.playlist.isEmpty();

			var emptyMessage = <span class="mute">No songs in queue</span>
			var title = <h2>Next up:</h2>

			return (
				<div id="playlist" >
					{(isEmpty) ? '' : title }
					<div class="playlist-inner">
        		{(isEmpty) ? emptyMessage : list}
        	</div>
	      </div>
      );
		}
	});

	return Playlist;
});
