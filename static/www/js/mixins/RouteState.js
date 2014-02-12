
define(['backbone'], function(Backbone) {
  var RouteState = {

    getInitialState: function() {
      return {
        route: ''
      };
    },

    componentWillMount: function () {
      Backbone.history.on('route', this.onRoute, this);
    },

    onRoute: function(router, route, params) {
      this.setState({
        route: route,
        routeParams: params
      });
    },

    componentWillUnmount: function() {
      Backbone.history.off(null, null, this);
    }
  };

  return RouteState;
});
