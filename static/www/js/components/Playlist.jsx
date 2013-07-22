/** @jsx React.DOM */
'use strict';

define(['react', 'components/PlaylistItem'], function(React, PlaylistItem){
	var Playlist = React.createClass({
		componentDidUpdate: function () {
			console.log('Playlist update');
			console.log(this.props);
		},

		render: function () {
			var list = this.props.playlist.map(function(song){
				return <PlaylistItem song={song} key={song.cid} />
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
