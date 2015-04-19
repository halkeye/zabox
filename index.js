'use strict';
var program = require('commander');
var Storage = require('./lib/storage');

program
  .version(require(__dirname + '/package.json').version)
  .description(require(__dirname + '/package.json').description)
  .option('-w, --webport <n>', 'Web Port', parseInt)
  .option('-s, --smtpport <n>', 'SMTP Port', parseInt)
  .option('--list-storages', 'List all available storages')
  .option('--storage <storage>', 'Storage Mode [test,memory,sqlite]', /^(test|memory|sqlite)$/, 'memory')
  .parse(process.argv);


var allStorages = Storage.allStorages();
if (program.listStorages)
{
  Object.keys(allStorages).forEach(function(name) {
    console.log(' - ' + name);
    console.log('   * ' + allStorages[name].description);
  });
  process.exit();
}

var storage = new allStorages[program.storage]();
var WebServer = require('./lib/webserver');
var SmtpServer = require('./lib/smtp');

var webPort = program.webport || 3000;
var smtpPort = program.smtpport || webPort + 1;

var webserver = new WebServer(webPort, storage);
webserver.run();

var smtpServer = new SmtpServer(smtpPort , null, storage);
smtpServer.run();
