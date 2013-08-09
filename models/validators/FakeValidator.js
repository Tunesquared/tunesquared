'use strict';

// Validates data from fake source
module.exports = function (data) {
	return typeof data === 'string' && data.length < 10 && (/^[a-z0-9]+$/).test(data);
};
