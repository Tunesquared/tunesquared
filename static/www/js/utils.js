'use strict';

define(function(){
	var utils = {
		noop: function (){},
		forceUpdateFix: function(ctx){
			return function(){
				ctx.forceUpdate(utils.noop);
			};
		},

		onceTrue: function() {
			var mem = 0;
			return function(){
				return !(mem++);
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
	};

	return utils;
});
