'use strict';
var util = require('util');
var Storage = require('../storage.js');

function StorageMemory(options) { };
util.inherits(StorageMemory, Storage);

module.exports = StorageMemory;
