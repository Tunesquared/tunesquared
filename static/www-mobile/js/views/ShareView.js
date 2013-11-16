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
      'click .sms' : 'sendSMS'
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

      //var qrelement = document.getElementById('qrcode');
      var qrelement =  this.$("#qrcode").get()[0];
      $(qrelement).empty();

      if(qrelement!==null){

        this.qrcode = new QR(qrelement, {
          text:  'http://'
          + window.location.host
          + '/party/'
          + this.party.get('name'),


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

    sendSMS: function(){
      var ua = navigator.userAgent.toLowerCase();
      var url = "sms:";
      url += (ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1) ? ";" : "?";
      url += "body=" + encodeURIComponent('http://'
          + window.location.host
          + '/party/'
          + this.party.get('name'));
      location.href = url;
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
