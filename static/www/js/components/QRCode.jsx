/** @jsx React.DOM */
'use strict';

var QR_TOOGLESHOW_ANIMATION_DELAY = 500; // ms

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

			new QR(qrelement, {
				text:  qrdata,
				width: QR_DIMENSIONS.width, 
				height: QR_DIMENSIONS.height
			}); 
			$(qrelement).hide();

		}, 

		toggleShow: function() {
			var qrelement = $(this.refs.qrcode.getDOMNode());
			var qrActionElement = $(this.refs.qraction.getDOMNode());

			if(qrelement.is(':hidden')) {
				qrelement.show(QR_TOOGLESHOW_ANIMATION_DELAY);
				qrActionElement.text(" Hide");
			}
			else {
				qrelement.hide(QR_TOOGLESHOW_ANIMATION_DELAY);
				qrActionElement.text(" Show");
			}
		},

		render: function() {
			return (
				<div ref="qrcode-container" class="panel">
					<div>
						<button onClick={this.toggleShow} class="qr-toogleshow btn icon-qrcode">
							<span ref="qraction"> Show</span> QR code
						</button>
						<br />
					</div>

					<div ref="qrcode" class="qr-content"></div>
				</div>
			)
		}
	});

	return QRCode;
});