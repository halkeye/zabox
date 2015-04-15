'use strict';
var util = require('util');
var StorageMemory = require('../storage/memory');

var message = {
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
};

function StorageTest(options) {
	StorageTest.super_.apply(this);
	this.store(message);
};

util.inherits(StorageTest, StorageMemory);

/*StorageTest.prototype.store = function(message) {
	console.log('[TestStorage] Saved new message: ', message);
};*/

module.exports = StorageTest;
