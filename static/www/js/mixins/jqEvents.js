'use strict';

define(['underscore', 'jquery'], function(_, $){

	var jqEvents = {
		componentDidMount: function() {
			var root =  $(this.getDOMNode());

			for(var i in this.jqEvents){

				var fn = this.jqEvents[i];
				if(!_.isFunction(fn)){
					fn = this[fn];
					if(!_.isFunction(fn))
						throw new Error('jqEvents : no handler to attach to {'+i+'}');
				}

				var res = i.split(' ');
				if(res.length > 2){
					throw new Error("Bad jqEvents delegation, refer to the doc");
				} else if(res.length == 2){
					root.on(res[1], res[0], fn)
				} else {
					root.on(i, fn);
				}
			}
		}
	};

	return jqEvents;
});
