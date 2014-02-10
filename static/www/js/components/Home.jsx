/** @jsx React.DOM */

var playlists_data = [
  {
    name: "jazz",
    thumb: "http://lol",
    songs: [
      {
        title: "test",
        source: "youtube",
        data: "12345"
      }, {
        title: "another test",
        source: "youtube",
        data: "4567"
      }
    ]
  },
  {
    name: "electro",
    thumb: "http://tuveuxunemedaille",
    songs: [
    ]
  }
];

'use strict';
define([
  'react',
  'jquery',
  'underscore',
  'components/SongVignette',
  'players/LayoutProxy',
  'models/suggestions',
  'utils',
  'components/QRCode'
], function(
  React,
  $,
  _,
  SongVignette,
  LayoutProxy,
  suggestions,
  utils,
  QRCode){

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


      this.refreshSuggestions();
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

    refreshSuggestions: function(cb) {
      var self = this;
      console.log('sugg');
      suggestions.fetch({
        success: function(sugg){
          self.setState({
            suggestions: sugg.toJSON()
          });
        }
      });
    },

    onChooseSong: function (song) {
      mixpanel.track('pick suggestion', {
        party_id: this.props.party.id,
        song_title: song.title
      });
      this.props.party.get('playlist').add(song);
    },

    render: function(){
      var party = this.props.party;

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

      var playlists = _.map(playlists_data, function(d) {
        return (
          <div class="playlist-vignette">
            <img src="{d.thumb}" />
            <span class="playlist-title">
              {d.title}
            </span>
          </div>
        );
      });

      var visu_placeholder = <div class="col-lg-12">
          <p class="lead">You seem to have no music in your playlist. How about you pick one of the following to get started.<br />
          These are bootstrap playlist, you can add any song from youtube (and soon many other sources) using the search bar above.
          </p>
          <div class="">
            {playlists}
          </div>
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
                <small>Vote for the next song with your smartphone now on tunesquared.com !</small>
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
