/** @jsx React.DOM */

'use strict';
define(['react', 'components/QRCode'], function(React, QRCode){

  var Settings = React.createClass({

    render: function() {

      var party = this.props.party.toJSON();

      return (
        <div class="col-lg-12">
          <div class="col-lg-6">
            <h2>Settings</h2>
            <form class="form-horizontal" role="form">
              <fieldset>
                <legend>Music</legend>
                <div class="form-group">
                  <label class="col-sm-4 control-label">
                    Sources
                  </label>
                  <div class="col-sm-8 sources-checkboxes">
                    <label class="checkbox-inline">
                      <input type="checkbox" id="inlineCheckbox1" value="source-youtube" checked/>
                      <i class="icon-youtube icon-large"></i>
                    </label>
                    <label class="checkbox-inline">
                      <input type="checkbox" id="inlineCheckbox2" value="option2" checked/> SoudCloud
                    </label>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-4 control-label">
                    Allow addition
                  </label>
                  <div class="col-sm-8">
                    <label class="checkbox-inline">
                      <input type="checkbox" id="inlineCheckbox1" checked="checked" value="allowAdd" />
                    </label>
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <legend>Party</legend>
                <div class="form-group">
                  <label class="col-sm-4 control-label">
                    Who can join
                  </label>
                  <div class="col-sm-8">
                    <select id="join-select" class="form-control">
                      <option>Anyone</option>
                      <option>Any of my friends</option>
                      <option>People from the list</option>
                      <option>People in the event</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-4 control-label">
                    List
                  </label>
                  <div class="col-sm-4">
                    <button type="button" class="btn btn-primary">Edit the list</button>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-4 control-label">
                    Event
                  </label>
                  <div class="col-sm-4">
                    <button type="button" class="btn btn-primary">link to an event</button>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      );
    }

  });

  return Settings;
});
