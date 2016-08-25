var mongoose = require('mongoose');
var validEmail = require('../helpers/validate/email');
var validAge = require('../helpers/validate/age');
var validDoctor = require('../helpers/validate/doctor');
var validWeight = require('../helpers/validate/weight');
var validHeight = require('../helpers/validate/height');
var validName = require('../helpers/validate/name');
var validSex = require('../helpers/validate/sex');
var validGroup = require('../helpers/validate/groups');
var Doctors = require('./Doctors');

var schema = mongoose.Schema({
	email: { type: String, trim: true, unique: true, required: true, ref: 'Creds', validate: [validEmail, "invalid email"] },
	doctor: { type: String, trim: true, required: true, ref: 'Doctors', validate: [validDoctor, "invalid doctor"] },
	group: [{ type: String, trim: true, lowercase: true, ref: 'Groups', validate: [validGroup, "invalid groups"] }],
	first_name: { type: String, trim: true, required: true, lowercase: true, validate: [validName, "invalid first name"] },
	last_name: { type: String, trim: true, required: true, lowercase: true, validate: [validName, "invalid last name"] },
	age: { type: Number, required: true, validate: [validAge, "invalid age"] },
	height: { type: Number, required: true, validate: [validHeight, "invalid height"] },
	weight: { type: Number, required: true, validate: [validWeight, "invalid weight"] },
	sex: { type: String, lowercase: true, trim: true, validate: [validSex, "invalid sex"] },
});

schema.pre('save', function (next, req) {
	var Doctors = mongoose.model('Doctors');
	var Creds = mongoose.model('Creds');
	var Groups = mongoose.model('Groups');
	var Diets = mongoose.model('Diets');


	var creds = { email: req.body['email'] };
	creds.password = req.body['pass'];
	creds.admin = false;
	var new_creds = new Creds(creds);
	//save new credentials
	new_creds.save(function (err, inserted) {
		if (err) return next(new Error(err));

		return next();
	});
});

schema.post('remove', function (patient, done) {
	var Creds = mongoose.model('Creds');

	Creds.remove({email:patient.email}).exec();
	done();
});

module.exports = mongoose.model('Patients', schema);