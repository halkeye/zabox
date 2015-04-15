'use strict';
var express = require('express');
var serveStatic = require('serve-static');
var Storage = require('./lib/storage/test.js');
var lessMiddleware = require('less-middleware');
var app = express();

var port = process.env.PORT || 3000;

var storage = new Storage();
app.use(lessMiddleware(__dirname + '/public/less', {
    dest: __dirname + '/public'
}));

app.use(serveStatic(__dirname + '/public'));

app.get('/api', function(req, res) {
  res.json(['json']);
});

app.get('/api/json', function(req, res) {
  res.json(['messages']);
});

app.get('/api/json/messages', function(req, res) {
  var ret = storage.all();
  res.json(
    ret.map(function(elm) {
      return { id: elm.id, from: elm.from || '', subject: elm.subject || '', to: elm.to || [] };
    })
  );
});

app.get('/api/json/messages/:guid', function(req, res) {
  var message = storage.get(req.params.guid);
  if (message) { res.json(message); }
  else { res.status(404).send("not found"); }
});

app.listen(port, function() {
  console.log("Now listening to on port:" + port);
});
