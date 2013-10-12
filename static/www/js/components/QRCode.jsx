/** @jsx React.DOM */
'use strict';

var QR_DIMENSIONS = {
	width: 200, 
	height: 200
};

define(['react', 'qrgenerator'], function(React, QR) {
	var QRCode = React.createClass({


		getInitalState: function() {
			return {
				data: null
			}
		}, 

		componentDidMount: function() {

			// Creates the appropriate QRCode and inserts it in the DOM
			var qrdata = this.props.data;
			var qrelement = this.refs.qrcode.getDOMNode();

			this.qrcode = new QR(qrelement, {
				text:  qrdata,
				width: QR_DIMENSIONS.width, 
				height: QR_DIMENSIONS.height
			}); 

		}, 

		componentDidUpdate: function() {
			var qrelement = this.refs.qrcode.getDOMNode();
			$(qrelement).empty();

			this.qrcode = new QR(qrelement, {
				text:  this.props.data,
				width: QR_DIMENSIONS.width, 
				height: QR_DIMENSIONS.height
			}); 
		},

		render: function() {
			return (
				<div ref="qrcode" class="qr-content"></div>
			)
		}
	});

	return QRCode;
});