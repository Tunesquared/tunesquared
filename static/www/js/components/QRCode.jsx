/** @jsx React.DOM */
'use strict';



var QR_PROPS = {
	width: 128,
	height: 128,
	margin: 10,
	colorLight: '#ffffff',
	colorDark: '#000000'
};


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
