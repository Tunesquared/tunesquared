/** @jsx React.DOM */

'use strict';
define([
  'react',
  'jquery',
  'underscore',
  'components/SongVignette',
  'components/QRCode',
  'components/Playlist',
  'players/LayoutProxy',
  'utils'
], function(
  React,
  $,
  _,
  SongVignette,
  QRCode,
  Playlist,
  LayoutProxy,
  utils){

	var Home = React.createClass({

		getInitialState: function() {
			return {
        visu: false, // Tells wether a visualisation is available or not
        suggestions: []
      };
		},

		componentDidMount: function() {
      this.props.party.on('change', this.updateQRCodeURL, this);
      LayoutProxy.on('change removed', this.updateVisualisation, this);

      var self = this;
      _.defer(function(){
        self.updateVisualisation(null, LayoutProxy.getLayout());
      });
      this.updateQRCodeURL();

      this.refreshSuggestions();
		},

    componentWillUnmount: function() {
      this.props.party.off(null, null, this);
      LayoutProxy.off(null, null, this);
      var self = this;
      _.defer(function(){
        self.updateVisualisation(LayoutProxy.getLayout(), null);
      });
    },

    componentWillReceiveProps: function(props) {
      this.updateQRCodeURL(props.party);
    },

    updateQRCodeURL: function(party) {
      party = party || this.props.party;
      this.setState({
        QRCodeURL: 'http://' +
          window.location.host +
          '/party/' +
          encodeURIComponent(party.get('name'))
      });
    },

    updateVisualisation: function(oldVisu, newVisu) {
      console.log('updating visualisation');
      if (oldVisu) {
        oldVisu.hide();
      }
      if (newVisu) {
        this.setState({
          visu: true
        });
        newVisu.attachTo(this.refs.visu.getDOMNode());
      } else {
        this.setState({
          visu: false
        });
      }
    },

    refreshSuggestions: function(cb) {
                        var self = this;
                        var request = '/api/suggestions';
      $.ajax({
        dataType: 'json',
        url: request,
        success: function(data){
          var res = [];
          for(var i in data){
            res.push({
              title   :   data[i].title,
              source  :   data[i].source,
              thumb   :   data[i].thumb,
              data    :   data[i].data
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

    onChooseSong: function (song) {
      this.props.party.get('playlist').add(song);
    },

		render: function(){

      console.log("rendering home");
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

      var visu_placeholder = <div>
        <h1>Party: {this.props.party.get('name')}</h1>
        <p class="lead">Your party is on! Pick some songs to get started. <br />
        You can also use the search bar if you want something specific.
        Let your guests scan this code to access your party more easily.
        </p>
        <p class="alert-success alert">Tip: Show this screen on a beamer in fullscreen for best effect!</p>
        <div class="panel panel-primary suggestions">
          <div class="panel-heading">
            <h3 class="panel-title">Suggestions:</h3>
          </div>
          <div class="panel-body">
            {suggestions}
          </div>
        </div>
      </div>;

			return (
				<div class="row home">
          <div class="col-3">
            <QRCode data={this.state.QRCodeURL} />
          </div>
          <div class="col-9 visu-container">
            { (!this.state.visu) ? visu_placeholder : <div id="visu-anchor" ref="visu" /> }
          </div>
          <div class="col-12">
            <Playlist playlist={this.props.party.get('playlist')} />
          </div>
				</div>
			);
		}
	});

	return Home;
});
