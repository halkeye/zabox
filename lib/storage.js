'use strict';
function Storage(options) {
	this.options = options;
};

Storage.prototype.all = function all() { throw new Exception("Unimplemented"); };
Storage.prototype.store = function store(message) { throw new Exception("Unimplemented"); };
Storage.prototype.get = function get(id) { throw new Exception("Unimplemented"); };

module.exports = Storage;

