/** @jsx React.DOM */

'use strict';
define(['react', 'components/QRCode', 'bootstrap/tooltip'], function(React, QRCode){

  var Home = React.createClass({
    componentDidMount: function() {
      $('body').tooltip({
          selector: '[data-toggle=tooltip]'
      });
    },

    render: function() {

      var party = this.props.party.toJSON();

      return (
        <div class="col-lg-12">
          <div class="col-lg-12">
            <div class="page-header">
              <h1>Party : {party.name}
                <a href="#party/settings" className="btn btn-default title-btn title-btn-right">
                  Settings
                  <i className="icon-wrench"></i>
                </a>
              </h1>
            </div>
          </div>
          <div class="col-lg-12">
            <p class="lead">You seem to have no music in your playlist. How about you pick one of the following to get started.<br />
            These are bootstrap playlist, you can add any song from youtube (and soon many other sources) using the search bar above.
            </p>
          </div>
          <div class="col-lg-6">
            <div class="page-header">
              <h2>Acess</h2>
            </div>
            <h3>Party name : {party.name}</h3>
            <div class="col-xs-12">
              <QRCode data={"http://tunesquared.com/party/" + encodeURIComponent(party.name)} />
            </div>
          </div>
          <div class="col-lg-6">
            <div class="page-header">
              <h2>Summary</h2>
            </div>
            <dl class="dl-horizontal">
              <dt>Duration</dt><dd>2:44:12</dd>
              <dt>Active users</dt><dd>145/234</dd>
              <dt>Total songs played</dt><dd>43</dd>
              <dt>Total votes</dt><dd>1234</dd>
            </dl>
            <a href="#party/history" class="btn btn-default"><i class="icon-time"></i> Show history</a>
          </div>
        </div>
      );
    }

  });

  return Home;
});
