/** @jsx React.DOM */
'use strict';

// Config
// minimum number of px hidden below the viewport before loading new results
var SCROLL_THRESHOLD_LOAD = 50;
// Number of items loaded each time UI fetches some results (should fill the screen)
var LOAD_CHUNK_SIZE = 16;

var VIGNETTES_PER_ROW = 3;


define(['underscore', 'jquery', 'react', 'search/Search', 'search/YoutubeSource', 'components/SongVignette'],
	function(_, $, React, SearchAggregator, YoutubeSource, SongVignette){

	var Search = React.createClass({

		getInitialState: function () {
			return {
				results: [],
				end: false,
				loading: false
			};
		},

		componentDidMount: function () {
			this.mainContents = $(window); // Keeps a local ref to main content for scrolling purpose
      this.mainContents.bind('scroll', this.checkScroll);

			this.searchAggregator = new SearchAggregator({
        chunkSize: LOAD_CHUNK_SIZE,
        preloadThreshold: 0 // Since we load results before the user reaches the bottom, we don't want to preload
      });

			this.searchAggregator.addSrc(YoutubeSource);
			// this.searchAggregator.addSrc('fakesrc');

      this.initQuery();
		},

		componentWillUnmount: function () {
			this.mainContents.unbind('scroll', this.checkScroll);
			this.abortQuery(false);
		},

		componentWillReceiveProps: function (newProps) {
			this.abortQuery();
			this.initQuery(newProps, true);
		},

		abortQuery: function (setState){
			if(this.queryIterator){
				this.queryIterator.release();
				this.queryIterator = null;
			}
			if(this.state.loading && setState !== false){
				this.setState({
					loading: false
				});
			}
		},

		initQuery: function (props, force) {
			console.log('init');
			if (props == null) props = this.props;

			this.setState({
				loading: false,
				end: false,
				results: []
			});

			if(this.queryIterator){
				this.queryIterator.release();
			}
			this.queryIterator = this.searchAggregator.query(props.query);
      this.queryIterator.exec();
      this.fetchNewResults(force);
		},

		fetchNewResults: function (force) {
			var results = [];

			if(!this.state.loading || force){
				this.setState({
					loading: true
				});

				SearchAggregator.util.fetchResults(this.queryIterator, LOAD_CHUNK_SIZE, {
					read: function (song) {
						results.push(song);
					}.bind(this),
					done: function () {
						this.onFetchDone(results);
					}.bind(this),
					end: function () {
						this.setState({
							end: true
						});
						this.onFetchDone(results);
					}.bind(this)
	      });
			}
		},

		onFetchDone: function (results) {
			this.setState({
				loading: false,
				results: this.state.results.concat(results)
			});

			if(!this.state.end)
				this.checkScroll();
		},

		checkScroll: function (results) {
			var el = $(this.getDOMNode());
			var offset = (el.height() - this.mainContents.scrollTop() - this.mainContents.height());
			if (offset < SCROLL_THRESHOLD_LOAD) {
				this.fetchNewResults();
			}
		},

		onChooseSong: function (song) {
			mixpanel.track('pick search', {
				party_id: this.props.party.id,
				song_title: song.title,
				platform: 'desktop'
			});
			this.props.party.get('playlist').add(song);
		},

		doSearch: function() {
			window.location.hash = 'search/'+this.refs['search-input'].state.value;
		},

		render: function(){
			var i = 0, j = 0, vignettes = [];
			var results = this.state.results;

			var vignettes = results.map(function(r) {
				return <SongVignette onClick={this.onChooseSong} song={r} />;
			}, this);

			var loader = (this.state.loading) ?
					<div class="row">
						<div class="col-lg-1 col-lg-offset-5">
							<img src="img/ajax-loader.gif" title="loading" alt="loading" />
						</div>
					</div> : '';

			var endSign = (this.state.end) ?
					<div class="row">
						<div class="col-lg-2 col-lg-offset-5">
							{(this.state.results.length === 0) ? 'No results found' : 'no more results' }
						</div>
					</div> : '';

			return (
				<div class="col-lg-8 col-lg-offset-2">
					<div class="row">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<a class="btn btn-default top-element" href="#"><i class="icon-chevron-left"></i> Back</a>
						</div>
					</div>
					<form class="row search-form" onSubmit={this.doSearch}>
						<div className="col-lg-5 col-lg-offset-3 col-md-5 col-md-offset-3 col-sm-5 col-sm-offset-1 col-xs-9 col-xs-offset-1">
							<input ref="search-input" type="search" class="form-control" defaultValue={this.props.query} />
						</div>
						<div class="col-lg-1 col-md-1 col-sm-1 col-xs-12">
							<input type="submit" class="btn btn-primary btn-large center-block" value="Search" />
						</div>
					</form>
					<hr />
					<h2>Search results for {this.props.query}:</h2>
					{vignettes}
					{loader}
					{endSign}
				</div>
			);
		}
	});

	return Search;
});
