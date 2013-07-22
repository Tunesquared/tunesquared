'use strict';

define(function(){
	var utils = {
		noop: function (){},
		forceUpdateFix: function(ctx){
			return function(){
				ctx.forceUpdate(utils.noop);
			};
		}
	};

	return utils;
});
