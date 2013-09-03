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

        var button;
        var link;
        if (message.indexOf('flash') != -1){
                  link = "http://get.adobe.com/flashplayer/";
                  button = "Install Flash Player";
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
                  <a class="btn btn-primary" href={link} target="_blank">{button}</a>
                </div>
              </div>
            </div>
          </div>
        );
      }
    });
    return ErrorDialog;
  });