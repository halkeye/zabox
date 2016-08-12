'use strict';
var _ = require('lodash');
var path = require('path');
var fs = require('fs');

var defaults = { messageLimit: false };

function Storage (options) {
  this.options = _.assign({}, defaults, options);
}

Storage.prototype.all = function all () { throw new Error('Unimplemented'); };
Storage.prototype.store = function store (message) { throw new Error('Unimplemented'); };
Storage.prototype.get = function get (id) { throw new Error('Unimplemented'); };
Storage.prototype.settings = function settings () { return this.options; };

Storage.allStorages = function allStorages () {
  var allStorages = {};
  fs.readdirSync(path.join(__dirname, '/storage/')).forEach(function (file) {
    allStorages[file.replace(/\.js$/, '')] = require(path.join(__dirname, '/storage/', file));
  });
  return allStorages;
};

module.exports = Storage;
