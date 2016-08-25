var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('cors')
var passport = require('passport');

module.exports = function (app) {
	app.use(cors());

	app.use(cookieParser());
	app.use(session({ secret: 'building a blog'}));

	app.use(bodyParser());

	app.use(passport.initialize());

	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.locals.session = req.session;
		next();
	});
}