'use strict';

var utils = module.exports = {

  path: {
    join: function () {
      var p = arguments[0];

      for (var i = 1; i < arguments.length; i++) {
        if (p.charAt(p.length - 1) !== '/') {
          p += '/';
        }
        if (arguments[i].charAt(0) === '/') {
          p = p.substring(0, p.length - 1);
        }
        p += arguments[i];
      }

      return p;
    }
  },

  guid: (function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return function () {
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    };
  })(),

  defaults: function (obj, defaults) {

    var ret = utils.copy(obj);

    for (var i in defaults) {
      if (typeof obj[i] === 'undefined') ret[i] = defaults[i];
    }

    return ret;
  },

  copy: function (obj) {
    var ret = {};

    for (var i in obj) {
      ret[i] = obj[i];
    }

    return ret;
  },

  exclude: function (obj, props) {
    if (typeof props === 'string') props = [props];

    var ret = {};

    for (var i in obj) {
      if (props.indexOf(i) == -1)
        ret[i] = obj[i];
    }

    return ret;
  },

  /*
    Returns a function which, when called, will call fn only once.
    Every subsequent calls will be redirected to def or will be nooped.

    @param {function} fn - function to be called once.
    @param {function} [def] - function called every time return function is called if it has already been called.
  */
  oneShot: function (fn, def) {
    var called = false;
    return function() {
      if (!called) {
        called = true;
        return fn.apply(this, arguments);
      } else if (def != null){
        return def.apply(this, arguments);
      }
    };
  },

  capitalize: function (str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
  }
};
