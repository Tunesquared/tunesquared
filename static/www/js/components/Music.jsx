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
        <h1>Music <small>Add songs you want to listen to.</small></h1>
      </div>
      <p>
      </p>
      <div class="alert">
        <strong>Hint:</strong> Remember that your guests can add their own songs, but you need some music to get the party started.<br />
        Give them good ideas by putting in the music you like ;)
      </div>
      <h2>Pick one of our instant playlists:</h2>
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
