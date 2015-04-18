'use strict';
var util = require('util');
var StorageMemory = require('../storage/memory');

var messages = [{
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
},{
    id: "b5c8999-665f-42b5-a431-42327d3bff6a",
    from: "Gavin Mogan <gavin@gavinmogan.com>",
    timestamp: "2010-03-01T13:00:00Z",
    to: [ "Gavin Mogan <gavin@gavinmogan.com>", "Sean Everest <sean.b.everest@gmail.com>" ],
    cc: [ ],
    bcc: [ ],
    subject: "This message has no HTML",
    body: {
      plain: "My First Heading\nMy first paragraph."
    }
}];

function StorageTest(options) {
  StorageTest.super_.apply(this);
  messages.forEach(this.store.bind(this));
};

util.inherits(StorageTest, StorageMemory);

StorageTest.description = "In memory engine that automatically adds test emails (Mainly for development/testing)";
module.exports = StorageTest;
