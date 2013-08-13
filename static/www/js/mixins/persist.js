/* Mixin for React components. Allows persistence of some useful UI props.
	Usage :
		save(values) : stores a hash of values
			any unspecified value that was previously saved stays were it is.
			Stores only modified values

	load() : retreived all previously saved values
*/
'use strict';
define(['underscore', 'json', 'shims/localStorage'], function(_){
	return {
		save: function (data, options) {
			options = options || {};
			if (!this._persist) {
				load();
			}

			this._persist = _.defaults(data, this._persist);

			// saves
			localStorage.setItem('reactstore_' + this.persistId, JSON.stringify(this._persist));

		},

		load: function () {
			if (!this.persistId)
				throw new Error('Component must specify a persistId property in order to use persist mixin');

			this._persist = JSON.parse(
				localStorage.getItem('reactstore_' + this.persistId) || '{}'
			);

			return this._persist;
		}
	};
});
