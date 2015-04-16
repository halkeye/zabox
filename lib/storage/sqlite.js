'use strict';
var util = require('util');
var Storage = require('../storage.js');

function StorageSqlite(options) {
	StorageSqlite.super_.apply(this);
	this.options = options;
};
util.inherits(StorageSqlite, Storage);

StorageSqlite.prototype.settings = function settings() {
	return {
		messageLimit: false
	};
};

module.exports = StorageSqlite;
