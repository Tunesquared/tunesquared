/** @jsx React.DOM */
'use strict';

define(['react', 'components/PlaylistItem', 'utils', 'models/Playlist'], function(React, PlaylistItem, utils){

	var ITEMS_N = 5; // Number of playlist item shown

	var Playlist = React.createClass({

		getInitialState: function() {
			return {
				searchVal: ''
			};
		},

		componentDidUpdate: function () {
		},

		componentWillMount: function () {
			this.setModels(this.props.party);
		},
		componentWillUnmount: function() {
			this.setModels(); // Will unregister all callbacks
		},

		componentWillReceiveProps: function (newProps) {
			this.setModels(newProps.party);
		},


		setModels: function(party) {
			if(this.playlist) {
				this.playlist.off(null, null, this);
				this.props.party.off(null, null, this);
			}

			if (party) {
				this.playlist = party.get('playlist') || new Playlist();
				party.on('change', utils.forceUpdateFix(this));
				this.playlist.on('add remove change sort', utils.forceUpdateFix(this), this);
			}
		},

		onSearchChange: function(event) {
			var q = event.target.value;
			this.setState({
				searchVal: q
			});
		},

		render: function () {
			var i = 0, searchVal = this.state.searchVal;
			var lowerSearchVal = searchVal.toLowerCase();

			var list = this.playlist.reject(this.props.party.isCurrent)
			.filter(function(el) {
				return el.get('title').toLowerCase().indexOf(lowerSearchVal) != '-1';
			})
			.map(function(song){
				return <PlaylistItem
						pos={++i}
						song={song}

						// We need to add spice to the key otherwise react fails to detect change
						key={song.cid + song.get('votes_yes') + song.get('votes_no')} />
			});

			var isEmpty = this.playlist.isEmpty();

			var emptyMessage = <span class="mute">No songs in queue</span>

			return (
				<div id="playlist" >
					<h2>Playlist:</h2>
					<div class="playlist-search">
						<input type="text" ref="search" class="form-control"
							value={searchVal} onChange={this.onSearchChange}
							placeholder="Search a song..."/>
					</div>
					<div class="playlist-inner">
        		{(isEmpty) ? emptyMessage : list}
        	</div>
	      </div>
      );
		}
	});

	return Playlist;
});
