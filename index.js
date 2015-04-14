'use strict';
var express = require('express');
var serveStatic = require('serve-static');
var app = express();

var port = process.env.PORT || 3000;

app.use(serveStatic(__dirname + '/public'));

app.get('/api', function(req, res) {
  res.json(['endpoint1','endpoint2']);
});

app.listen(port, function() {
  console.log("Now listening to on port:" + port);
});
