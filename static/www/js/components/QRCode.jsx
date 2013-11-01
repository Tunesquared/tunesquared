/** @jsx React.DOM */
'use strict';

/*
	Dark background prevents QR from being read (see issue #25)
	There are two solutions:
	- 1: add a light colored margin, the code gets even uglier this way but it's readable
	- 2: reverse colors, this might lead to compatibility issues
*/

// Solution 1:
/*
var QR_PROPS = {
	width: 128,
	height: 128,
	margin: 5,
	colorLight: '#ffffff',
	colorDark: '#000000'
};
//*/
// Solution 2:
//*
var QR_PROPS = {
	width: 128,
	height: 128,
	margin: 0,
	colorLight: '#000000',
	colorDark: '#ffffff'
};
//*/


define(['react', 'qrgenerator'], function(React, QR) {
	var c = 0;
	var QRCode = React.createClass({

		getInitalState: function() {
			return {
				data: null
			};
		},

		componentDidMount: function() {
			this.generate();
		},

		componentDidUpdate: function() {
			this.generate();
		},

		// Creates the appropriate QRCode and inserts it in the DOM
		generate: function() {
			if (this.qrcode)
				this.qrcode.clear();
			var qrelement = this.refs.qrcode.getDOMNode();
			$(qrelement).empty();

			this.qrcode = new QR(qrelement, {
				text:  this.props.data,
				width: QR_PROPS.width,
				height: QR_PROPS.height,
				colorDark: QR_PROPS.colorDark,
				colorLight: QR_PROPS.colorLight
			});

			qrelement.style.padding = QR_PROPS.margin + 'px';
			qrelement.style['background-color'] = QR_PROPS.colorLight;
			qrelement.style.width = (QR_PROPS.margin*2 + QR_PROPS.width) + 'px';
			qrelement.style.height = (QR_PROPS.margin*2 + QR_PROPS.height) + 'px';
		},

		render: function() {
			return (
				<div class="qr-code">
					<div ref="qrcode" class="qr-inner">
					</div>
				</div>
			);
		}
	});

	return QRCode;
});
