'use strict';
var util = require('util');
var Storage = require('../storage.js');

var messages = [];
messages.push({
    id: "b5c89620-665f-42b5-a431-42327d3bff6a",
    from: "Gavin Mogan <gavin@gavinmogan.com>",
    timestamp: "2007-03-01T13:00:00Z",
    to: [ "Gavin Mogan <gavin@gavinmogan.com>", "Sean Everest <sean.b.everest@gmail.com>" ],
    cc: [ ],
    bcc: [ ],
    subject: "This is my first message",
    body: {
      plain: "My First Heading\nMy first paragraph.",
      html: '<!DOCTYPE html> <html> <body> <h1>My First Heading</h1> <p>My first paragraph.</p> </body> </html>',
    }
});

function StorageTest(options) { }
util.inherits(StorageTest, Storage);

StorageTest.prototype.all = function all() { return messages; };
StorageTest.prototype.store = function(message) {
	console.log('[TestStorage] Saved new message: ', message);
};
StorageTest.prototype.get = function get(id) {
	return messages.filter(function(elm) {
		return elm.id === id;
	})[0];
};

module.exports = {
  all: function all() { return messages; },
  store: function(message) {
    console.log('[TestStorage] Saved new message: ', message);
  },
  get: function get(id) {
    return messages.filter(function(elm) {
      return elm.id === id;
    })[0];
  }
};

module.exports = StorageTest;
