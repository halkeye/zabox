'use strict';
var express = require('express');
var serveStatic = require('serve-static');
var app = express();

var port = process.env.PORT || 3000;

app.use(serveStatic(__dirname + '/public'));

app.get('/api', function(req, res) {
  res.json(['json']);
});

app.get('/api/json', function(req, res) {
  res.json(['messages']);
});

app.get('/api/json/messages', function(req, res) {
  res.json([{id: "guid-goes-here", from: "Gavin Mogan <gavin@gavinmogan.com>", subject: "This is my first message"}]);
});

app.get('/api/json/messages/:guid', function(req, res) {
  res.json({id: "guid-goes-here", from: "Gavin Mogan <gavin@gavinmogan.com>", subject: "This is my first message"});
});

app.listen(port, function() {
  console.log("Now listening to on port:" + port);
});
