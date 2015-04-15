'use strict';
var util = require('util');
var _ = require('lodash');
var Storage = require('../storage.js');

var defaults = {
	messageLimit : 100
};

function StorageMemory(options) {
	StorageMemory.super_.apply(this);
	this.options = _.assign({}, defaults, options);
	this.messages = [];
};
util.inherits(StorageMemory, Storage);

StorageMemory.prototype.all = function all() {
	return this.messages;
};

StorageMemory.prototype.store = function store(message) {
	this.messages.push(message);
	while (this.messages.length > this.options.messageLimit) {
		this.messages.unshift();
	}
};

StorageMemory.prototype.get = function get(id) {
	return this.messages.filter(function(elm) {
		return elm.id === id;
	})[0];
};

module.exports = StorageMemory;
