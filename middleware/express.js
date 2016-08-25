var mongoose = require('mongoose');
var express = require('express');
var routes = require('../routes');
var middleware = require('../middleware');

var app = express();

middleware(app);
routes(app);

exports = module.exports = app;