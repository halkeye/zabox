'use strict';
var uuid = require('node-uuid');
var MailParser = require('mailparser').MailParser;
var SMTPServer = require('smtp-server').SMTPServer;

function SmtpServer (port, logger, storage) {
  this.port = port;
  this.storage = storage;
  this.logger = logger;

  var onData = function onData (stream, session, callback) {
    var mailparser = new MailParser({ });

    var message = { id: uuid.v4(), body: { plain: '', html: '' }, raw: [] };
    stream.pipe(mailparser);
    stream.on('data', function (chunk) {
      message.raw.push(chunk.toString());
    });

    mailparser.on('end', function (mailObject) {
      message.timestamp = mailObject.date.toISOString();
      message.body.plain = mailObject.text;
      message.body.html = mailObject.html;
      message.subject = mailObject.subject;
      if (mailObject.headers['message-id']) {
        message.id = mailObject.headers['message-id'].replace(/[^a-zA-Z1-9-/]/g, '_');
      }

      ['to', 'from', 'bcc', 'cc'].forEach(function (field) {
        if (!mailObject[field]) { return; }
        message[field] = mailObject[field].map(function (elm) {
          if (!elm.name) { return elm.address; }
          return elm.name + ' <' + elm.address + '>';
        });
      });
      if (message.from) { message.from = message.from[0]; }
      message.subject = mailObject.subject;
      storage.store(message);

      callback();
    });
  };

  this.server = new SMTPServer({
    disabledCommands: ['AUTH'],
    logger: logger,
    onMailFrom: function (address, session, callback) { return callback(); },
    onAuth: function (auth, session, callback) { return callback(); },
    // onAuth: onAuth.bind(this),
    // onRcptTo: onRcptTo.bind(this)
    onData: onData
  });

  this.server.on('error', function (err) {
    console.log('Error %s', err.message);
  });
}

SmtpServer.prototype.close = function (cb) {
  this.server.close(cb);
};

SmtpServer.prototype.run = function (cb) {
  this.server.listen(this.port, cb);
};

module.exports = SmtpServer;
