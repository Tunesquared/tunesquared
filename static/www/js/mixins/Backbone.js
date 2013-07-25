'use strict';

// TODO : rename this mixin to something more meaningful
define(['utils'], function (utils) {
  var BackboneMixin = {
    componentDidMount: function () {
      // Whenever there may be a change in the Backbone data, trigger a reconcile.
      this.getBackboneModels().map(function (model) {
        model.on('add change remove sync', utils.forceUpdateFix(this), this);
      }.bind(this));
    },
    componentWillUnmount: function () {
      // Ensure that we clean up any dangling references when the component is destroyed.
      this.getBackboneModels().map(function (model) {
        model.off(null, null, this);
      }.bind(this));
    }
  };

  return BackboneMixin;
});
