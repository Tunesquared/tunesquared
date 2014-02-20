/** @jsx React.DOM */
define(['react', 'models/suggestions'], function(React, suggestions) {
  var PlaylistSuggest = React.createClass({

    getInitialState: function() {
      return {
        loading: false
      };
    },

    componentDidMount: function() {
      var self = this;
      suggestions.on('sync', function() {
        suggestions.forEach(function(playlist) {
          playlist.set('songs', _.shuffle(playlist.get('songs')));
        });
        self.forceUpdate();
      });
      suggestions.fetch();

      this.props.party.get('playlist').on('addMany')
    },

    onPlaylistClick: function(playlist) {
      var self = this;
      return function(evt) {
        evt.preventDefault();
        mixpanel.track('pick suggestion', {
          party_id: self.props.party.id,
          playlist_name: playlist.get('name')
        });
        self.props.party.get('playlist').addMany(playlist.get('songs'));
        self.props.party.get('playlist').once('add', function() {
          self.setState({
            loading: false
          });
        });
        self.setState({
          loading: true
        });
      };
    },

    render: function() {
      var self = this;
      var suggEl = suggestions.map(function(playlist) {
        return <a href="#" onClick={self.onPlaylistClick(playlist)} className="suggIcon">
          <div class="overlay" />
          <img src={playlist.get('thumb')} /><br />
          <span className="suggTitle">{playlist.get('name')}</span>
        </a>;
      });
      return <div className="suggBox">{(this.state.loading) ? <div className="overlay"><img src="img/ajax-loader.gif" /></div> : ''}
      <div className="x-scroller" >{suggEl}</div></div>;
    }
  });

  return PlaylistSuggest;
});
