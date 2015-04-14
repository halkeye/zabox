'use strict';
var uuid = require('node-uuid');
var MailParser = require("mailparser").MailParser;
var SMTPServer = require('smtp-server').SMTPServer;



module.exports = function(port, logger, storage) {
  var onData = function onData(stream, session, callback) {
    var mailparser = new MailParser({ });

    var message = { id: uuid.v4(), body: { plain: '', html: '' }, };
    stream.pipe(mailparser);


    mailparser.on('end', function(mail_object) {
      message.timestamp = mail_object.date.toISOString();
      message.body.plain = mail_object.text;
      message.body.html = mail_object.html;
      message.subject = mail_object.subject;
      if (mail_object.headers['message-id']) {
        message.id = mail_object.headers['message-id'].replace(/[^a-zA-Z1-9-/]/g, '_');
      }

      ['to','from','bcc','cc'].forEach(function(field) {
        if (!mail_object[field]) { return; }
        message[field] = mail_object[field].map(function(elm) {
          if (!elm.name) { return elm.address; }
          return elm.name + " <" + elm.address + ">";
        });
      });
      message.subject = mail_object.subject;
      storage.store(message);
    });
    mailparser.on('end', callback);
  };

  var server = new SMTPServer({
    disabledCommands: ['AUTH'],
    logger: logger,
    onMailFrom: function(address, session, callback) { return callback(); },
    onAuth: function(auth, session, callback) { return callback(); },
    // onAuth: onAuth.bind(this),
    //onRcptTo: onRcptTo.bind(this)
    onData: onData
  });

  server.on('error', function(err) {
    console.log('Error %s', err.message);
  });
  server.listen(port);

};
