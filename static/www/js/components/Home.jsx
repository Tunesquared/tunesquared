/** @jsx React.DOM */

'use strict';
define([
  'react',
  'jquery',
  'underscore',
  'components/SongVignette',
  'players/LayoutProxy',
  'models/suggestions',
  'utils',
  'components/QRCode',
  'components/PlaylistSuggest'
], function(
  React,
  $,
  _,
  SongVignette,
  LayoutProxy,
  suggestions,
  utils,
  QRCode,
  PlaylistSuggest){

  var Visu = React.createClass({
    getInitialState: function() {
      return {
        visu: LayoutProxy.getLayout() != null, // Tells wether a visualisation is available or not
        suggestions: []
      };
    },

    componentDidMount: function() {
      LayoutProxy.on('change removed', this.updateVisualisation, this);

      var self = this;
      _.defer(function(){
        self.updateVisualisation(null, LayoutProxy.getLayout());
      });
    },

    componentWillUnmount: function() {
      LayoutProxy.off(null, null, this);
      this.updateVisualisation(LayoutProxy.getLayout(), null, {setState: false});
    },



    updateVisualisation: function(oldVisu, newVisu, options) {
      options = _.defaults(options || {}, {
        setState: true
      });

      if (oldVisu) {
        oldVisu.hide();
      }
      if (newVisu) {
        if (options.setState !== false) {
          this.setState({
            visu: true
          });
        }
        newVisu.attachTo(this.refs.visu.getDOMNode());
      } else if (options.setState !== false) {
        this.setState({
          visu: false
        });
      }
    },

    render: function(){
      var party = this.props.party;

      var visu_placeholder = <div class="col-lg-12">
          <p class="lead"><strong>Hi there !</strong> You can now add songs to your playlist.
          Use the search bar on the left to find what you need. We also provide <strong>playlists</strong>
          you can use as a starting point.
          </p>
          <p>
            Once you've added a few songs, sit back and relax, let your friends take over control of your playlist.<br />
            In case you need more songs, check out the <a href="#music">music page</a>.
          </p>
          <h2>Pick an instant playlist to get started</h2>
          <PlaylistSuggest party={this.props.party} />
        </div>;

      var currentSong = this.props.party.get('currentSong');

      var visu_real = <div class="col-lg-12">
        <h2 className="songTitle">{(currentSong && currentSong.get('title') || '') + ' '
          /*<small>{(currentSong && currentSong.get('artist')) || ''}</small>*/
        }
        </h2>
        <div id="visu-anchor" ref="visu" />

      </div>;
      return (
        <div class="visu-container home">
          <div class="col-lg-12">
            <div class="page-header clearfix">
              <div class="pull-right header-QR">
                <QRCode
                  data={"http://tunesquared.com/party/" + encodeURIComponent(party.get('name'))} />
              </div>
              <h1>Party : {party.get('name')}<br />
                <small>Add music or vote for the next songs on <strong>tunesquared.com</strong>!<br />Simply flash this code using your smartphone:</small>
              </h1>
            </div>
          </div>
          { (!this.state.visu) ? visu_placeholder : visu_real }
        </div>
      );
    }
  });

  return Visu;
});
