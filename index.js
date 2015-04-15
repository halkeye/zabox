'use strict';
var Storage = require('./lib/storage/test.js');
var port = process.env.PORT || 3000;
var storage = new Storage();

var WebServer = require('./lib/webserver');
var webserver = new WebServer(port, storage);
webserver.run();

