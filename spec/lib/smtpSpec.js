var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var SmtpServer = require(__dirname + '/../../lib/smtp');
var Storage = require(__dirname + '/../../lib/storage/memory');


describe('SmtpServer', function() {
  beforeEach(function(cb) {
    var self = this;
    self.storage = new Storage();
    self.smtpServer = new SmtpServer(0, null, self.storage);
    self.smtpServer.run(function() {
      // Create a SMTP transport object
      self.transport = nodemailer.createTransport(smtpTransport({
        port: self.smtpServer.server.server.address().port,
        tls:  {
             rejectUnauthorized: false
        },
        secure: false,
        host: 'localhost'
      }));
      cb();
    });
  });
  afterEach(function(cb) {
    this.smtpServer.close(cb);
  });

  it('Has Working Raw', function(cb) {
    var self = this;
    var message = {
      messageId: "my-random-message-id@example.com",
      // sender info
      from: 'Sender Name <sender@example.com>',
      // Comma separated list of recipients
      to: '"Receiver Name" <nodemailer@disposebox.com>',
      // Subject of the message
      subject: 'My Test Subject ✔', //
      headers: { 'X-Laziness-level': 1000 },
      // plaintext body
      text: 'Hello to myself!\nFrom myself',
    };

    self.transport.sendMail(message, function(err) {
      self.storage.get('_my-random-message-id_example_com_').then(function(message) {
        expect(message).not.toBeNull();
        var raw = message.raw.join('').split(/\n|\r/).filter(function(line) {
          return !line.match(/^Date:/)
        });
        expect(raw).toEqual([
          'Content-Type: text/plain',
          '',
          'From: Sender Name <sender@example.com>',
          '',
          'To: Receiver Name <nodemailer@disposebox.com>',
          '',
          'Subject: My Test Subject =?UTF-8?Q?=E2=9C=94?=',
          '',
          'Message-Id: <my-random-message-id@example.com>',
          '',
          'X-Laziness-Level: 1000',
          '',
          'X-Mailer: nodemailer (1.3.4; +http://www.nodemailer.com;',
          '',
          ' SMTP/1.0.2[client:1.2.0])',
          '',
          'Content-Transfer-Encoding: 7bit',
          '',
          //'Date: Sat, 25 Apr 2015 02:32:30 +0000',
          '',
          'MIME-Version: 1.0',
          '',
          '',
          '',
          'Hello to myself!',
          '',
          'From myself'
        ]);
        cb();
      });
      self.transport.close();
    });

  });
  it('Has working text body', function(cb) {
    var self = this;
    var message = {
      messageId: "my-random-message-id@example.com",
      // sender info
      from: 'Sender Name <sender@example.com>',
      // Comma separated list of recipients
      to: '"Receiver Name" <nodemailer@disposebox.com>',
      // Subject of the message
      subject: 'My Test Subject ✔', //
      headers: { 'X-Laziness-level': 1000 },
      // plaintext body
      text: 'Hello to myself!\nFrom myself',
    };

    self.transport.sendMail(message, function(err) {
      self.transport.close();
      self.storage.get('_my-random-message-id_example_com_').then(function(message) {
        expect(message).not.toBeNull();
        expect(message.body.plain).toEqual('Hello to myself!\nFrom myself');
        cb();
      });
    });

  });
});

