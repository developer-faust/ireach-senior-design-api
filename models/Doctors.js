var mongoose = require('mongoose');
var validEmail = require('../helpers/validate/email');
var validFirstName = require('../helpers/validate/name');
var validLastName = require('../helpers/validate/name');
var validSpecialty = require('../helpers/validate/name');
var validHospital = require('../helpers/validate/name');
var q = require('q');

var schema = mongoose.Schema({
	email: { type: String, trim: true, unique: true, ref: 'Creds', validate: [validEmail, "invalid email"] },
	first_name: { type: String, trim: true, required: true, lowercase: true, validate: [validFirstName, "invalid first name"] },
	last_name: { type: String, trim: true, required: true, lowercase: true, validate: [validLastName, "invalid last name"] },
	specialty: { type: String, trim: true, required: true, lowercase: true, validate: [validSpecialty, "invalid specialty"] },
	hospital: { type: String, trim: true, required: true, lowercase: true },
});

schema.pre('save', function (next, req) {
	var Creds = mongoose.model('Creds');
	var Patients = mongoose.model('Patients');

	var creds = { email: req.body['email'] };
	creds.password = req.body['pass'];
	creds.admin = false;

	var new_creds = new Creds(creds);
	new_creds.save(function (err, inserted) {
		if (err) return next(new Error(err));
		next();
	});
});

schema.post('remove', function (doc, done) {
	var Creds = mongoose.model('Creds');
	var Patients = mongoose.model('Patients');

	Creds.remove({email:doc.email}).exec();

	Patients.update({doctor:doc.email}, {$set:{doctor:null}}, {multi:true}, function (err, removed) {
		done();
	});
});

module.exports = mongoose.model('Doctors', schema);