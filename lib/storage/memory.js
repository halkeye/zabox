'use strict';
var util = require('util');
var _ = require('lodash');
var Storage = require('../storage.js');
var Promise = require('promise');

var defaults = {
  messageLimit : 100
};

function StorageMemory(options) {
  StorageMemory.super_.apply(this);
  this.options = _.assign({}, this.options, defaults, options);
  this.messages = [];
};
util.inherits(StorageMemory, Storage);

StorageMemory.prototype.all = function all() {
  return new Promise(function(fulfill, reject) {
    return fulfill(this.messages);
  }.bind(this));
};

StorageMemory.prototype.store = function store(message) {
  this.messages.push(message);
  if (this.messages.length > this.options.messageLimit) {
    this.messages = this.messages.slice(-this.options.messageLimit);
  }
};

StorageMemory.prototype.get = function get(id) {
  return new Promise(function(fulfill, reject) {
    var message = this.messages.filter(function(elm) {
      return elm.id === id;
    })[0];
    fulfill(message);
  }.bind(this));
};

StorageMemory.description = "In memory engine. All emails will be lost on restart.";
module.exports = StorageMemory;
