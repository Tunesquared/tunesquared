/** @jsx React.DOM */

define(['react', 'components/PlaylistSuggest'], function(React, Suggestions) {

  var Music = React.createClass({

    doSearch: function(evt) {
      evt.preventDefault();
      window.location.hash = "search/" + this.refs.searchInput.state.value;
    },

    render: function() {
      return <div className="col-lg-12">
      <div className="page-header">
        <h1>Music <small>Find the music you want to hear.</small></h1>
      </div>
      <p>
      </p>
      <div class="alert">
        <strong>Pro tip:</strong> Remember that your guests can add their own songs. You only need some music to play before they take control.<br />
        Also, songs in the playlist are more visible, you can use this to promote songs you like ;)
      </div>
      <h2>Pick one of our thematic selections:</h2>
      <Suggestions party={this.props.party} />
      <h2>Or search songs yourself:</h2>
      <form class="row search-form" onSubmit={this.doSearch}>
        <div className="col-lg-5 col-lg-offset-3 col-md-5 col-md-offset-3 col-sm-5 col-sm-offset-1 col-xs-9 col-xs-offset-1">
          <input ref="searchInput" type="search" class="form-control" />
        </div>
        <div class="col-lg-1 col-md-1 col-sm-1 col-xs-12">
          <input type="submit" class="btn btn-primary btn-large center-block" value="Search" />
        </div>
      </form></div>;
    }
  });

  return Music;
});
