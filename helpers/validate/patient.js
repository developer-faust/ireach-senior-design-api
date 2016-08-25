var Patients = require('../../models/Patients');
module.exports = function (patient, done) {
	Patients.findOne({email:patient}, function (err, found) {
		if (found) done(true);
		else done(false);
	});
}