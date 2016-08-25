var errors = require('./errors');
var patients = require('./patients');
var groups = require('./groups');
var doctors = require('./doctors');
var diet = require('./diet');
var admin = require('./admin');
var raw_data = require('./raw_data');
var data = require('./data');
var initialize = require('./initialize');

var mongoose = require('mongoose');

module.exports = function(app) {

	patients(app);
	groups(app);
	doctors(app);
	diet(app);
	admin(app);
	raw_data(app);
	data(app);
	initialize(app);

	errors(app);
}