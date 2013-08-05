/** @jsx React.DOM */
'use strict';

define(['react', 'components/PlaylistItem', 'utils'], function(React, PlaylistItem, utils){
	var Playlist = React.createClass({
		componentDidUpdate: function () {
			// console.log('Playlist update');
			// console.log(this.props);
		},

		componentDidMount: function () {
			this.props.playlist.on('add remove change sort', utils.forceUpdateFix(this));
		},

		componentWillReceiveProps: function (newProps) {
			if(this.props.playlist)
				this.props.playlist.off(null, null, this);
			newProps.playlist.on('add remove change sort', utils.forceUpdateFix(this));
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

			return (
				<div id="playlist">
	          <h4>Playlist :</h4>
	          <div id="playlist-container">{list}</div>
	      </div>
      );
		}
	});

	return Playlist;
});
