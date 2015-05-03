'use strict';
var util = require('util');
var _ = require('lodash');
var async = require('async');

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
  "  `id` varchar(255) not null PRIMARY KEY, " +
  "  `from` varchar(255) not null, "+
  "  `timestamp` datetime, "+
  "  `subject` varchar(255) "+
  ")");
  this.db.run("CREATE TABLE IF NOT EXISTS addresses ( " +
  "  `id` varchar(255) not null, " +
  "  `type` varchar(10) not null, " +
  "  `address` varchar(255) not null, " +
  "  unique(`id`,`type`,`address`) " +
  ")");
  this.db.run("CREATE TABLE IF NOT EXISTS bodies ( " +
  " `id` varchar(255) not null, " +
  " `type` varchar(10) not null, " +
  " `message` blob not null," +
  "  unique(`id`,`type`) " +
  ")");
  this.db.run("CREATE TABLE IF NOT EXISTS raw ( " +
  " `id` varchar(255) not null PRIMARY KEY, " +
  " `raw` blob not null" +
  ")");
};
util.inherits(StorageSqlite, Storage);

var sql = "SELECT m.id, m.`from`, m.timestamp, m.subject, a.type as address_type, a.address, b.type as body_type, b.message as body_message  FROM messages m LEFT JOIN addresses a ON (m.id=a.id) LEFT JOIN bodies b ON (m.id=b.id)";

var search = function search(where, id, callback) {
  var self = this;
  if (!where) { where = ""; }

  var messages = [];
  var messageCache = {};

  var handleRow = function(row) {
    var message = messageCache[row.id] || {};
    ['from','id','timestamp','subject'].forEach(function(field) {
      if (!_.isUndefined(row[field])) { message[field] = row[field] + ''; }
    });
    if (!_.isUndefined(row.address_type)) {
        if (!message[row.address_type]) { message[row.address_type] = []; }
        message[row.address_type].push(row.address);
    }
    if (!_.isUndefined(row.body_type)) {
        if (!message.body) { message.body = {}; }
        message.body[row.body_type] = row.body_message;
    }
    if (!_.isUndefined(row.raw)) {
        message.raw = JSON.parse(row.raw);
    }

    if (!messageCache[row.id]) {
      messageCache[row.id] = message;
      messages.push(message);
    }
  };

  var safe_db_each = function(sql, id, cb) {
    if (id) {
      self.db.each(sql, id, function each(err, row) {
        if (err) { throw err; }
        handleRow(row);
      },cb);
    } else {
      self.db.each(sql, function each(err, row) {
        if (err) { throw err; }
        handleRow(row);
      },cb);
    }
  };

  async.parallel([
    function(cb) {
      var sql = "SELECT m.id, m.`from`, m.timestamp, m.subject FROM messages m " + where + " ORDER BY timestamp, m.id ";
      safe_db_each(sql, id, cb);
    },
    function(cb) {
      var sql = "SELECT a.id, a.type as address_type, a.address FROM addresses a " + where;
      safe_db_each(sql, id, cb);
    },
    function(cb) {
      var sql = "SELECT b.id, b.type as body_type, b.message as body_message FROM bodies b " + where;
      safe_db_each(sql, id, cb);
    },
    function(cb) {
      var sql = "SELECT r.id, r.raw FROM raw r " + where;
      safe_db_each(sql, id, cb);
    },
  ], function(err, results) {
    callback(messages);
  });
};

StorageSqlite.prototype.all = function all() {
  var self = this;
  var messages = [];
  var messageCache = {};
  return new Promise(function(fulfill, reject) {
//    self.db.serialize(function() {
      search.apply(self, [null, null, function(messages) {
        if (self.options.messageLimit !== false )
        {
          return fulfill(messages.slice(-self.options.messageLimit));
        }
        else
        {
          return fulfill(messages);
        }
      }]);
//    });
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
    if (message.raw) {
      self.db.run("INSERT INTO raw (id, raw) VALUES (?, ?)", message.id, JSON.stringify(message.raw));
    }
  });
  /*this.messages.push(message);
  if (this.messages.length > this.options.messageLimit) {
    this.messages = this.messages.slice(-this.options.messageLimit);
  }*/
};

StorageSqlite.prototype.get = function get(id) {
  var self = this;
  return new Promise(function(fulfill, reject) {
    search.apply(self, [" WHERE id=? ", id, function(messages) {
      if (messages && messages.length > 0) {
        return fulfill(messages[0]);
      } else {
        return reject();
      }
    }]);
  });
}

StorageSqlite.description = "Stores mails to sqlite database file";
module.exports = StorageSqlite;
