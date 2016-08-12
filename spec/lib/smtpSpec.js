/*globals require: false, describe: false, beforeEach: false, afterEach: false, it: false, expect: false */
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var path = require('path');
var SmtpServer = require(path.join(__dirname, '/../../lib/smtp'));
var Storage = require(path.join(__dirname, '/../../lib/storage/memory'));


describe('SmtpServer', function() {
  beforeEach(function(cb) {
    var self = this;
    self.storage = new Storage();
    self.smtpServer = new SmtpServer(0, null, self.storage);
    self.smtpServer.run(function() {
      // Create a SMTP transport object
      self.transport = nodemailer.createTransport(smtpTransport({
        port: self.smtpServer.server.server.address().port,
        tls: { rejectUnauthorized: false },
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
      xMailer: 'xmailer-test-string',
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
          return !line.match(/^Date:/) && line.length > 0;
        });
        var response = [
          'Content-Type: text/plain',
          'X-Laziness-Level: 1000',
          'From: Sender Name <sender@example.com>',
          'To: Receiver Name <nodemailer@disposebox.com>',
          'Subject: My Test Subject =?UTF-8?Q?=E2=9C=94?=',
          'Message-ID: <my-random-message-id@example.com>',
          'X-Mailer: xmailer-test-string',
          'Content-Transfer-Encoding: 7bit',
          'MIME-Version: 1.0',
          'Hello to myself!',
          'From myself'
        ];
        response.sort();
        raw.sort();
        expect(raw).toEqual(response);
        cb();
      });
      self.transport.close();
    });

  });
  it('Has working text body', function(cb) {
    var self = this;
    var smtpMessage = {
      xMailer: 'xmailer-test-string',
      messageId: "my-random-message-id@example.com",
      // sender info
      from: 'Sender Name <sender@example.com>',
      // Comma separated list of recipients
      to: '"Receiver Name" <nodemailer@disposebox.com>',
      // Subject of the message
      subject: 'My Test Subject ✔', //
      headers: { 'X-Laziness-level': 1000 },
      // plaintext body
      text: 'Hello to myself!\nFrom myself\n'
    };

    self.transport.sendMail(smtpMessage, function(err) {
      if (err) { throw err; }
      self.transport.close();
      self.storage.get('_my-random-message-id_example_com_').then(function(message) {
        expect(message).not.toBeNull();
        expect(message.body.plain).toEqual('Hello to myself!\nFrom myself\n');
        cb();
      });
    });

  });
});

