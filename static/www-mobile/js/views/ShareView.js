/*
  ShareView.js

  A QR-Code make it easy to share the page with friends on the party. Get everyone involved and have fun!
*/

var QR_PROPS = {
  width: 128,
  height: 128,
  margin: 10,
  colorLight: '#ffffff',
  colorDark: '#000000'
};

define([
	// libs
  '$', 'backbone', 'underscore', 'qrgenerator',

  // application deps
  //'models/Party',

  // implicit libs
  'bs/collapse'

  //], function($, Backbone, _, Party) {

  ], function($, Backbone, _, QR) {

  'use strict';


var ShareView = Backbone.View.extend({

    events: {

    },



    initialize: function() {
      // Binds event callbacks to be sure "this" refers to a PartyView instance
      //_.bindAll(this);
      this.template = _.template($('#shareTemplate').html());


    },

    render: function() {

      this.$el.html(this.template({}));

    },

    qr_load: function(){
      if (this.qrcode)
        this.qrcode.clear();

      var qrelement = document.getElementById('qrcode');
      //var qrelement = $("#qrcode");
      $(qrelement).empty();

      if(qrelement!==null){

        this.qrcode = new QR(qrelement, {
          text:  'http://'
          + window.location.host
          + '/party/'
          /*+ name of party */,


          width: QR_PROPS.width,
          height: QR_PROPS.height,
          colorDark: QR_PROPS.colorDark,
          colorLight: QR_PROPS.colorLight
        });

        $(qrelement).css({
          'padding': QR_PROPS.margin + 'px',
          'background-color': QR_PROPS.colorLight,
          'width' : (QR_PROPS.margin*2 + QR_PROPS.width) + 'px',
          'height': (QR_PROPS.margin*2 + QR_PROPS.height) + 'px'
        });
      };

    },


    setParty: function(party) {
      /* events stuff */
      if (this.party) this.party.off(null, null, this);
      party.on('sync', this.render, this);

      this.party = party;
      this.render();
    }


  });

  return ShareView;
});
