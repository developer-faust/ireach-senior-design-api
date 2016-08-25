var mongoose = require('mongoose');
var app = require('./middleware/express');
var https = require('https');
var fs = require('fs');
var cron = require('./cron');

mongoose.connect('mongodb://localhost/m3', function(err) {
	if (err) throw err;
	console.log('connected');

	// crontab included here
	cron();

	var options = {
		key: fs.readFileSync('ssl/server.key'),
		cert: fs.readFileSync('ssl/server.crt'),
		ca: fs.readFileSync('ssl/ca.crt')
	}

	https.createServer(options, app).listen('5025', function () {
		console.log('now listen on localhost:5025');
	});
});
