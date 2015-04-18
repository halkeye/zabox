'use strict';
var util = require('util');
var _ = require('lodash');
var Storage = require('../storage.js');

var defaults = {};
function StorageSqlite(options) {
  StorageSqlite.super_.apply(this);
  this.options = _.assign({}, this.options, defaults, options);
};
util.inherits(StorageSqlite, Storage);

StorageSqlite.description = "Unimplemented - Stores mails to sqlite database file";
module.exports = StorageSqlite;
