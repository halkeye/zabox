'use strict';
var program = require('commander');

program
  .version(require(__dirname + '/package.json').version)
  .description(require(__dirname + '/package.json').description)
  .option('-w, --webport <n>', 'Web Port', parseInt)
  .option('-s, --smtpport <n>', 'SMTP Port', parseInt)
  .option('--list-storages', 'List all available storages')
  .option('--storage <storage>', 'Storage Mode [test,memory,sqlite]', /^(test|memory|sqlite)$/, 'memory')
  .parse(process.argv);


if (program.listStorages)
{
  require('fs').readdirSync(__dirname + '/lib/storage/').forEach(function(file) {
    var Storage = require(__dirname + '/lib/storage/' + file);
    console.log(' - ' + file.replace('.js', ''));
    console.log('   * ' + Storage.description);
  });
  process.exit();
}

var Storage = require('./lib/storage/' + program.storage + '.js')
var storage = new Storage();
var WebServer = require('./lib/webserver');
var SmtpServer = require('./lib/smtp');

var webPort = program.webport || 3000;
var smtpPort = program.smtpport || webPort + 1;

var webserver = new WebServer(webPort, storage);
webserver.run();

var smtpServer = new SmtpServer(smtpPort , null, storage);
smtpServer.run();
