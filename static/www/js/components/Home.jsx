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
			return { };
		},

		componentDidMount: function() {
      this.props.party.on('change', this.updateQRCodeURL, this);
      LayoutProxy.on('change removed', this.updateVisualisation, this);
      this.updateVisualisation(null, LayoutProxy.getLayout());
      this.updateQRCodeURL();
		},

    componentWillUnmount: function() {
      this.props.party.off(null, null, this);
      LayoutProxy.off(null, null, this);

      this.updateVisualisation(LayoutProxy.getLayout(), null);
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
      if (oldVisu) {
        oldVisu.hide();
      }
      if (newVisu) {
        newVisu.attachTo(this.refs.visu.getDOMNode());
      }
    },

		render: function(){

			return (
				<div class="row home">
          <div class="col-3">
            <QRCode data={this.state.QRCodeURL} />
          </div>
          <div class="col-9 visu-container">
            <div id="visu-anchor" ref="visu"/>
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
