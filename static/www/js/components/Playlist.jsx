/** @jsx React.DOM */
'use strict';

define(['react', 'components/PlaylistItem', 'utils'], function(React, PlaylistItem, utils){
	var Playlist = React.createClass({
		componentDidUpdate: function () {
			// console.log('Playlist update');
			// console.log(this.props);
		},

		componentDidMount: function () {
			this.props.party.get('playlist').on('add remove change sort', utils.forceUpdateFix(this));
		},

		componentWillReceiveProps: function (newProps) {
			if(this.props.party.get('playlist'))
				this.props.party.get('playlist').off(null, null, this);
			newProps.party.get('playlist').on('add remove change sort', utils.forceUpdateFix(this));
		},

		render: function () {
			var i = 0;
			var isNext = utils.onceTrue();
			var party = this.props.party;
			var list = this.props.party.get('playlist').map(function(song){
				if (song.id === party.get('currentSong').id) return;

				return <PlaylistItem
						pos={++i}
						song={song}
						isNext={isNext()}

						// We need to add spice to the key otherwise react fails to detect change
						key={song.cid + song.get('votes_yes') + song.get('votes_no')} />
			});

			return (
				<div id="playlist" class="panel panel-primary" >
					<div class="panel-heading">
	          <h3 class="panel-title">Playlist :</h3>
         	</div>
        	<div id="playlist-container" class="panel-body list-group">{list}</div>
	      </div>
      );
		}
	});

	return Playlist;
});
