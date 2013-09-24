/** @jsx React.DOM */
'use strict';

define(['react', 'qrcode'], function(React, QR) {
	var QRCode = React.createClass({

		getInitalState: function() {
			return {
				data: null
			}
		}, 

		componentDidMount: function() {
			// At this point, QR is undefined. Wut?
			// (qrcode lib defined in ../main.js:23)

			// Creates the appropriate QRCode and inserts it in the DOM
			//new QR(this.refs.qrcode.getDOMNode(), this.props.data); 

		}, 

		render: function() {
			return (
				<div ref="qrcode">
					QRCode ici : <br />
				</div>
			)
		}
	});

	return QRCode;
});