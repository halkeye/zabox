/* eslint-env: jasmine, mocha */
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var path = require('path');
require('should');

var SmtpServer = require(path.join(__dirname, '/../../lib/smtp'));
var Storage = require(path.join(__dirname, '/../../lib/storage/memory'));

var storage;
var smtpServer;
var transport;

var setupSMTP = function (done) {
  var logger = false;
  storage = new Storage();
  smtpServer = new SmtpServer(0, logger, storage);
  smtpServer.run(function () {
    // Create a SMTP transport object
    transport = nodemailer.createTransport(smtpTransport({
      logger: logger,
      port: smtpServer.server.server.address().port,
      tls: { rejectUnauthorized: false },
      secure: false,
      host: '127.0.0.1'
    }));
    done();
  });
};

var closeSMTP = function (done) {
  smtpServer.close(done);
};

describe('SmtpServer', function () {
  describe('', function () {
    beforeEach(setupSMTP);
    afterEach(closeSMTP);

    it('Has Working Raw', function () {
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
      return transport.sendMail(message)
        .then(function () {
          transport.close();
          transport = null;
        })
        .then(function () {
          return storage.get('_my-random-message-id_example_com_');
        })
        .then(function (messageResponse) {
          messageResponse.should.be.ok();
          var raw = messageResponse.raw.join('').split(/\n|\r/).filter(line => {
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
          raw.should.eql(response);
        });
    });
  });
  describe('', function () {
    beforeEach(setupSMTP);
    afterEach(closeSMTP);
    it('Has working text body', function () {
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
        text: 'Hello to myself!\nFrom myself\n'
      };
      return transport.sendMail(message)
        .then(function () {
          transport.close();
          transport = null;
        })
        .then(function () {
          return storage.get('_my-random-message-id_example_com_');
        })
        .then(function (messageResponse) {
          messageResponse.should.be.ok();
          messageResponse.body.plain.should.eql('Hello to myself!\nFrom myself\n');
        });
    });
  });
});
