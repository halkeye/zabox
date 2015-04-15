'use strict';
var util = require('util');
var Storage = require('../storage.js');

function StorageSqlite(options) { };
util.inherits(StorageSqlite, Storage);

module.exports = StorageSqlite;
