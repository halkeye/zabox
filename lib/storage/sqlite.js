'use strict';
var util = require('util');
var _ = require('lodash');
var Storage = require('../storage.js');

var Promise = require('promise');
var sqlite3 = require('sqlite3').verbose();

var defaults = {
  filename: ':memory:'
};

function StorageSqlite(options) {
  StorageSqlite.super_.apply(this);
  this.options = _.assign({}, this.options, defaults, options);
  this.db = new sqlite3.Database(this.options.filename);
  this.db.on('error', function(err) { throw err; });
  this.db.run("CREATE TABLE IF NOT EXISTS messages ( "+
  "  `id` varchar(255) not null, "+
  "  `from` varchar(255) not null, "+
  "  `timestamp` datetime, "+
  "  `subject` varchar(255) "+
  ")");
  this.db.run("CREATE TABLE IF NOT EXISTS addresses ( " +
  "  `id` varchar(255) not null, " +
  "  `type` varchar(10) not null, " +
  "  `address` varchar(255) not null " +
  ")");
  this.db.run("CREATE TABLE IF NOT EXISTS bodies ( " +
  " `id` varchar(255) not null, " +
  " `type` varchar(10) not null, " +
  " `message` blob not null" +
  ")");
};
util.inherits(StorageSqlite, Storage);

var sql = "SELECT m.id, m.`from`, m.timestamp, m.subject, a.type as address_type, a.address, b.type as body_type, b.message as body_message  FROM messages m LEFT JOIN addresses a ON (m.id=a.id) LEFT JOIN bodies b ON (m.id=b.id)";

var processMessage = function processMessage(message, row) {
  message.from      = row.from;
  message.id        = row.id;
  message.timestamp = row.timestamp;
  message.subject   = row.subject;
  message.subject   = row.subject;
  if (row.address_type)
  {
    if (!message[row.address_type]) { message[row.address_type] = []; }
    message[row.address_type].push(row.address);
  }
  if (row.body_type)
  {
    if (!message.body) { message.body = {}; }
    message.body[row.body_type] = row.body_message;
  }
};

StorageSqlite.prototype.all = function all() {
  var self = this;
  var messages = [];
  var messageCache = {};
  return new Promise(function(fulfill, reject) {
    self.db.serialize(function() {
      self.db.each(sql + " ORDER BY timestamp, m.id ",
      function each(err, row) {
        if (err) { throw err; }
        var message = messageCache[row.id] || {};
        message.from      = row.from;
        message.id        = row.id;
        message.timestamp = row.timestamp;
        message.subject   = row.subject;
        message.subject   = row.subject;
        if (row.address_type)
        {
          if (!message[row.address_type]) { message[row.address_type] = []; }
          message[row.address_type].push(row.address);
        }
        if (row.body_type)
        {
          if (!message.body) { message.body = {}; }
          message.body[row.body_type] = row.body_message;
        }

        if (!messageCache[row.id]) {
          messageCache[row.id] = message;
          messages.push(message);
        }
      }, function complete() {
        if (self.options.messageLimit !== false )
        {
          return fulfill(messages.slice(-self.options.messageLimit));
        }
        else
        {
          return fulfill(messages);
        }
      });
    });
  });
};

StorageSqlite.prototype.store = function store(message) {
  var self = this;
  self.db.serialize(function() {
    self.db.run("INSERT INTO messages (id, `from`, timestamp, subject) VALUES (?, ?, ?, ?)",
      message.id, message.from, message.timestamp, message.subject
    );

    ['to','cc','bcc'].forEach(function(type) {
      if (!message[type]) { return; }
      message[type].forEach(function(person) {
        self.db.run("INSERT INTO addresses (id, type, address) VALUES (?, ?, ?)",
          message.id, type, person
        );
      });
    });

    if (message.body) {
      Object.keys(message.body).forEach(function(type) {
        if (message.body[type] === '') { return; }
        self.db.run("INSERT INTO bodies (id, type, message) VALUES (?, ?, ?)",
          message.id, type, message.body[type]
        );
      });
    }
  });
  /*this.messages.push(message);
  if (this.messages.length > this.options.messageLimit) {
    this.messages = this.messages.slice(-this.options.messageLimit);
  }*/
};

StorageSqlite.prototype.get = function get(id) {
  var self = this;
  var message = {};
  return new Promise(function(fulfill, reject) {
    self.db.each(sql + " WHERE m.id=? ORDER BY timestamp, m.id ", id, function each(err, row) {
      if (err) { throw err; }
      processMessage(message, row);
    }, function complete() {
      return fulfill(message);
    });
  });
}

// StorageSqlite.prototype.get = function get(id) {

StorageSqlite.description = "Unimplemented - Stores mails to sqlite database file";
module.exports = StorageSqlite;
