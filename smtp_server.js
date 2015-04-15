'use strict';
var Storage = require('./lib/storage/test.js');
var storage = new Storage()
require('./lib/smtp.js')(3001, null, storage);
