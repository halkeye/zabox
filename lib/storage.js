'use strict';
var _ = require('lodash');

var defaults = {
  messageLimit: false
};
function Storage(options) {
  this.options = _.assign({}, defaults, options);
};

Storage.prototype.all = function all() { throw new Error("Unimplemented"); };
Storage.prototype.store = function store(message) { throw new Error("Unimplemented"); };
Storage.prototype.get = function get(id) { throw new Error("Unimplemented"); };
Storage.prototype.settings = function settings() {
  return this.options;
};


module.exports = Storage;
