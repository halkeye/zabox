/* eslint-env: jasmine */
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var path = require('path');
var SmtpServer = require(path.join(__dirname, '/../../lib/smtp'));
var Storage = require(path.join(__dirname, '/../../lib/storage/memory'));

var setupSMTP = function (cb) {
  var self = this;
  self.storage = new Storage();
  self.smtpServer = new SmtpServer(0, null, self.storage);
  self.smtpServer.run(function () {
    // Create a SMTP transport object
    self.transport = nodemailer.createTransport(smtpTransport({
      port: self.smtpServer.server.server.address().port,
      tls: { rejectUnauthorized: false },
      secure: false,
      host: 'localhost'
    }));
    cb();
  });
};
var closeSMTP = function (cb) {
  this.smtpServer.close(cb);
};

describe('SmtpServer', function () {
  describe('', function () {
    beforeEach(setupSMTP);
    afterEach(closeSMTP);

    it('Has Working Raw', function () {
      var self = this;
      var message = {
        xMailer: 'xmailer-test-string',
        messageId: 'my-random-message-id@example.com',
        // sender info
        from: 'Sender Name <sender@example.com>',
        // Comma separated list of recipients
        to: '"Receiver Name" <nodemailer@disposebox.com>',
        // Subject of the message
        subject: 'My Test Subject ✔', //
        headers: { 'X-Laziness-level': 1000 },
        // plaintext body
        text: 'Hello to myself!\nFrom myself'
      };

      return self.transport.sendMail(message).then(() => {
        return self.storage.get('_my-random-message-id_example_com_').then(message => {
          expect(message).not.toBeNull();
          var raw = message.raw.join('').split(/\n|\r/).filter(line => {
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
        });
      }).then(() => {
        self.transport.close();
      });
    });
  });
  describe('', function () {
    beforeEach(setupSMTP);
    afterEach(closeSMTP);
    it('Has working text body', function () {
      var self = this;
      var smtpMessage = {
        xMailer: 'xmailer-test-string',
        messageId: 'my-random-message-id@example.com',
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

      return self.transport.sendMail(smtpMessage).then(function () {
        return self.storage.get('_my-random-message-id_example_com_').then(function (message) {
          expect(message).not.toBeNull();
          expect(message.body.plain).toEqual('Hello to myself!\nFrom myself\n');
        });
      }).then(function () {
        self.transport.close();
      });
    });
  });
});
