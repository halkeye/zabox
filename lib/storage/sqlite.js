'use strict';
var util = require('util');
var Storage = require('../storage.js');

function StorageSqlite(options) {
	StorageSqlite.super_.apply(this);
	this.options = options;
};
util.inherits(StorageSqlite, Storage);

module.exports = StorageSqlite;
