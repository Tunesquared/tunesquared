/** @jsx React.DOM */
'use strict';
define(['underscore', 'react', 'search/Search', 'search/FakeSource'], function(_, React, SearchAggregator, FakeSource){
	var Search = React.createClass({

		getInitialState: function () {
			return {
				results: []
			};
		},

		componentDidMount: function () {
			this.searchAggregator = new SearchAggregator({
        chunkSize: this.CHUNK_SIZE,
        preloadThreshold: 3
      });

      this.searchAggregator.addSrc(FakeSource);

      this.initQuery();
		},


		componentDidUpdate: function () {

		},

		componentWillReceiveProps: function () {
			this.initQuery();
		},

		initQuery: function () {
			this.queryIterator = this.searchAggregator.query(this.props.query);
      this.queryIterator.exec();
		},

		fetchNextBloc: function () {
			Search.util.fetchBloc(this.queryIterator, 20, this.onSearchBloc);
		},

		onSearchBloc: function (results) {
			this.setState({
				results: results
			});
		},

		render: function(){

			var results = _.map(this.state.results, function(){
				return (
					<div class="span3">
						<div class="song-vignette">
							<div class="img-container">
								<div class="img-action-overlay">
									<a href="#" data-role="add-song">
										<img src="img/overlay-add.png" title="add to playlist" />
									</a>
								</div>
								<img src="image" />
							</div>
							<ul class="song-attributes">
								<li>
									<strong> title </strong>
								</li>
								<li>by artist </li>
							</ul>
						</div>
					</div>
				);
			});

			return (
				<div class="container-fluid">
					<div class="row-fluid">
						<h3>Search results for {this.props.query}</h3>
					</div>
				</div>
			);
		}
	});

	return Search;
});
