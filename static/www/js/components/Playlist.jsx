/** @jsx React.DOM */
'use strict';

define(['react', 'components/PlaylistItem', 'utils', 'mixins/persist', 'bootstrap/tooltip'],
	function(React, PlaylistItem, utils, persist){

	var ITEMS_N = 5; // Number of playlist item shown

	var Playlist = React.createClass({

		mixins: [persist],

		persistId: 'sidePlaylist',

		getInitialState: function() {
			return {
				searchVal: ''
			};
		},

		componentDidUpdate: function() {
		},

		componentWillMount: function () {
			this.setModels(this.props.party);

			this.tooltipEn = this.load().tooltipEn;
			if (this.tooltipEn == null) this.tooltipEn = true;
			this.hasTooltip = false;
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

			if (!this.hasTooltip && this.tooltipEn) {
				$(this.refs['search'].getDOMNode()).tooltip({
					container: 'body',
					title: SEARCH_TOOLTIP_TEXT,
					trigger: 'manual'
				}).tooltip('show');
				this.hasTooltip = true;
			} else if (this.hasTooltip && q === '') {
				$(this.refs['search'].getDOMNode()).tooltip('hide');
				this.hasTooltip = false;
			}
		},

		doSearch: function(evt) {
			evt.preventDefault();

			this.setState({
				searchVal: ''
			});


			if (this.tooltipEn) {
				this.save({
					tooltipEn: false
				});
				this.tooltipEn = false;
				$(this.refs['search'].getDOMNode()).tooltip('hide');
			}
			window.location.hash = 'search/' + encodeURIComponent(this.state.searchVal);
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
				<div className="playlist" >
					<div class="playlist-search">
						<form onSubmit={this.doSearch}>
							<input type="text" ref="search" class="form-control"
								value={searchVal} onChange={this.onSearchChange}
								placeholder="Search a song..."/>
						</form>
					</div>
					<div class="playlist-inner">
        		{(isEmpty) ? emptyMessage : list}
        	</div>
	      </div>
      );
		}
	});

	var SEARCH_TOOLTIP_TEXT = 'Press enter for more results.';

	return Playlist;
});
