'use strict';

/*
	Validates data comming from youtube
*/
module.exports = function(data) {
	return typeof data === 'string' && /^[a-zA-Z0-9]{13}/.test(data);
};
