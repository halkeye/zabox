'use strict';
var Storage = require('./lib/storage/test.js');
var port = process.env.PORT || 3000;
var storage = new Storage();

var WebServer = require('./lib/webserver');
var SmtpServer = require('./lib/smtp');


var webserver = new WebServer(port, storage);
webserver.run();

var smtpServer = new SmtpServer(port+1, null, storage);
smtpServer.run();
