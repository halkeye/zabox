'use strict';
var util = require('util');
var _ = require('lodash');
var Storage = require('../storage.js');

var defaults = {
  messageLimit: 100
};

function StorageMemory (options) {
  StorageMemory.super_.apply(this);
  this.options = _.assign({}, this.options, defaults, options);
  this.messages = [];
}
util.inherits(StorageMemory, Storage);

StorageMemory.prototype.all = function all () {
  return new Promise(function (resolve, reject) {
    return resolve(this.messages);
  }.bind(this));
};

StorageMemory.prototype.delete = function _delete (id) {
  return new Promise(function (resolve, reject) {
    this.messages = this.messages.filter(function (msg) { return msg.id !== id; });
    return resolve(true);
  }.bind(this));
};

StorageMemory.prototype.deleteAll = function deleteAll () {
  return new Promise(function (resolve, reject) {
    this.messages = [];
    return resolve(true);
  }.bind(this));
};

StorageMemory.prototype.store = function store (message) {
  return new Promise(function (resolve, reject) {
    this.messages.push(message);
    if (this.messages.length > this.options.messageLimit) {
      this.messages = this.messages.slice(-this.options.messageLimit);
    }
    return resolve();
  }.bind(this));
};

StorageMemory.prototype.get = function get (id) {
  return new Promise(function (resolve, reject) {
    var message = this.messages.find(function (elm) {
      return elm.id === id;
    });
    if (message == null) {
      return reject(new Error('No message for ' + id));
    }
    return resolve(message);
  }.bind(this));
};

StorageMemory.description = 'In memory engine. All emails will be lost on restart.';
module.exports = StorageMemory;
