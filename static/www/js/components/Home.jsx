/** @jsx React.DOM */
'use strict';
define(['react', 'jquery', 'underscore', 'components/SongVignette'], function(React, $, _, SongVignette){
	var Home = React.createClass({

		getInitialState: function() {
			return {
				suggestions: []
			};
		},

		componentDidMount: function() {
			this.refreshSuggestions();
		},

		onChooseSong: function (song) {
			this.props.party.get('playlist').add(song);
		},

		refreshSuggestions: function(cb) {
			var self = this;
			var request = 'https://gdata.youtube.com/feeds/api/standardfeeds/most_popular?category=Music&alt=json';
      $.ajax({
        dataType: 'jsonp',
        url: request,
        success: function(data){
          var res = [];
          for(var i in data.feed.entry){
            res.push({
              title   :   data.feed.entry[i].title.$t,
              source     :   'youtube',
              thumb   :   data.feed.entry[i].media$group.media$thumbnail[1].url,
              data    :   _.last(data.feed.entry[i].id.$t.split('/'))
            });
          }
          self.setState({
						suggestions: res
					});
				},
        error: function(){
          console.error('error retreiving suggestions');
        }
      });
		},

		render: function(){
			var suggestions = [];
			for (var i = 0 ; i*3 < this.state.suggestions.length ; i++) {
				var row = [];
				for(var j = 0 ; i*3 + j < this.state.suggestions.length && j < 3; j++) {
					var sug = this.state.suggestions[i*3+j];
					row.push(<div class="col-4">
						<SongVignette song={sug} onClick={this.onChooseSong} />
					</div>);
				}
				suggestions.push(<div class="row">{row}</div>);
			}

			return ( 
				<div>
					<h1>Welcome to your party !</h1>
					<p class="lead">Use the search bar to add your first songs or pick one of our suggestions</p>
					<div class="panel panel-info">
						<div class="panel-heading">
							<h3 class="panel-title">Suggestions:</h3>
						</div>
						<div class="panel-body">
							{suggestions}
						</div>
					</div>
				</div>
			);
		}
	});

	return Home;
});
