/** @jsx React.DOM */
"use strict";
define ([
  'react',
  'jquery',
  'bootstrap/modal'],
  function (React,$){
    var ErrorDialog = React.createClass({

      componentDidMount : function(){
        $(this.getDOMNode()).modal('show');
      },

      render : function(){
        var errortype = this.props.type;
        var message = 'Error : ' + this.props.message;
        errortype = errortype[0].toUpperCase() + errortype.substring(1);

        var button = <a class="btn btn-primary" href="/" >Ok</a>;
        var link = "";

        // Oh man(u) !
        if (message.indexOf('flash') != -1){
          link = "http://get.adobe.com/flashplayer/";
          button = <a class="btn btn-primary" href={link} target="_blank">Install Flash Player</a>;
          window.onblur = function(){
            window.onfocus = function(){
             location.reload();
            };
          };
        }

        return (
          <div class="modal fade error" data-backdrop="static">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title">{errortype} Error</h4>
                </div>
                <div class="modal-body">
                  <p>{message}</p>
                  <p>{link}</p>
                </div>
                <div class="modal-footer">
                  {button}
                </div>
              </div>
            </div>
          </div>
        );
      }
    });
    return ErrorDialog;
  });
