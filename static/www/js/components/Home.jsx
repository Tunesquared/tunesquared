/** @jsx React.DOM */



      /* REFACTOR: put this somewhere
      var QRCodeURL =
        'http://'
        + window.location.host
        + '/party/'
        + encodeURIComponent(currentParty.get('name'));
      */

'use strict';
define([
  'react',
  'jquery',
  'underscore',
  'components/SongVignette',
  'components/QRCode',
  'utils'
], function(
  React,
  $,
  _,
  SongVignette,
  QRCode,
  utils){

	var Home = React.createClass({

		getInitialState: function() {
			return {
			};
		},

		componentDidMount: function() {
      this.props.party.on('change', this.updateQRCodeURL);
		},

    componentWillReceiveProps: function(props) {
      this.updateQRCodeURL(props.party);
    },

    updateQRCodeURL: function(party) {
      this.setState({
        QRCodeURL: 'http://' +
          window.location.host +
          '/party/' +
          encodeURIComponent(party.get('name'))
      });
    },

		onChooseSong: function (song) {
			this.props.party.get('playlist').add(song);
		},

		render: function(){

			return (
				<div>
					<div class="row home-row">
            <div class="col-3">
              <QRCode data={this.state.QRCodeURL} />
            </div>
            <div class="col-9">
              Player here
            </div>
          </div>
				</div>
			);
		}
	});

	return Home;
});
