'use strict';

var express = require('express');
var serveStatic = require('serve-static');
var lessMiddleware = require('less-middleware');

function WebServer(port, storage) {
	this.port = port;
	this.storage = storage;

	this.app = express();

	this.app.use(lessMiddleware(__dirname + '/../public/less', {
			dest: __dirname + '/../public'
	}));

	this.app.use(serveStatic(__dirname + '/../public'));

	this.app.get('/api', function(req, res) {
		res.json(['json']);
	});

	this.app.get('/api/json', function(req, res) {
		res.json(['messages']);
	});

	this.app.get('/api/json/messages', function(req, res) {
		var ret = this.storage.all();
		res.json(
			ret.map(function(elm) {
				return { id: elm.id, from: elm.from || '', subject: elm.subject || '', to: elm.to || [], timestamp: elm.timestamp };
			})
		);
	}.bind(this));

	this.app.get('/api/json/messages/:guid', function(req, res) {
		var message = this.storage.get(req.params.guid);
		if (message) { res.json(message); }
		else { res.status(404).send("not found"); }
	}.bind(this));
}

WebServer.prototype.getApp = function() {
	return this.app;
};

WebServer.prototype.run = function() {
	this.app.listen(this.port, function() {
		console.log("Now listening to on port:" + this.port);
	}.bind(this));
};

module.exports = WebServer;
