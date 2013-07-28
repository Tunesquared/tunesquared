'use strict';

var utils = module.exports = {

    path: {
        join: function(){
            var p = arguments[0];

            for(var i = 1 ; i < arguments.length ; i++){
                if(p.charAt(p.length - 1) !== '/'){
                    p += '/';
                }
                if(arguments[i].charAt(0) === '/'){
                    p = p.substring(0, p.length - 1);
                }
                p += arguments[i];
            }

            return p;
        }
    },

    guid: (function(){
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }

        return function() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        };
    })(),

    defaults: function(obj, defaults){

        var ret = utils.copy(obj);

        for(var i in defaults){
            if(typeof obj[i] === 'undefined') ret[i] = defaults[i];
        }

        return ret;
    },

    copy: function(obj){
        var ret = {};

        for(var i in obj){
            ret[i] = obj[i];
        }

        return ret;
    },

    exclude: function(obj, props){
        if(typeof props === 'string') props = [props];

        var ret = {};

        for(var i in obj){
            if(props.indexOf(i) == -1)
                ret[i] = obj[i];
        }

        return ret;
    },

    capitalize: function (str) {
        return str.substr(0,1).toUpperCase() + str.substr(1);
    }
};
