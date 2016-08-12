'use strict';

var path = require('path');
var express = require('express');
var serveStatic = require('serve-static');
var lessMiddleware = require('less-middleware');
var _ = require('lodash');

function WebServer (port, storage) {
  this.port = port;
  this.storage = storage;

  this.app = express();

  this.app.use(lessMiddleware(path.join(__dirname, '/../public/less'), {
    dest: path.join(__dirname, '/../public')
  }));

  this.app.use(serveStatic(path.join(__dirname, '/../public')));

  this.app.get('/api', function (req, res) {
    res.json(['json']);
  });

  this.app.get('/api/json', function (req, res) {
    res.json(['messages', 'smtp_settings']);
  });

  this.app.get('/api/json/messages', function (req, res) {
    this.storage.all().done(function (results) {
      res.json(
        results.map(function (elm) {
          return { id: elm.id, from: elm.from || '', subject: elm.subject || '', to: elm.to || [], timestamp: elm.timestamp };
        })
      );
    });
  }.bind(this));

  this.app.get('/api/json/messages/:guid', function (req, res) {
    this.storage.get(req.params.guid).then(function (message) {
      res.json(message);
    }, function () {
      res.status(404).send('not found');
    });
  }.bind(this));

  this.app.delete('/api/json/messages/:guid', function (req, res) {
    this.storage.delete(req.params.guid).then(function (message) {
      res.json(message);
    }, function () {
      res.status(404).send('not found');
    });
  }.bind(this));

  this.app.delete('/api/json/messages', function (req, res) {
    this.storage.deleteAll().then(function (message) {
      res.json(message);
    }, function () {
      res.status(404).send('not found');
    });
  }.bind(this));

  this.app.get('/api/json/smtp_settings', function (req, res) {
    res.json(_.assign(
      {},
      this.storage.settings(),
      {
        port: port + 1,
        hostname: req.headers.host.replace(/:\d+/, '')
      }
    ));
  }.bind(this));
}

WebServer.prototype.getApp = function () {
  return this.app;
};

WebServer.prototype.run = function () {
  this.app.listen(this.port, function () {
    console.log('Now listening to on port:' + this.port);
  }.bind(this));
};

module.exports = WebServer;
