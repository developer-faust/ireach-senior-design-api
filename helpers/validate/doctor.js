var Doctors = require('../../models/Doctors');
module.exports = function (doctor, done) {
	Doctors.findOne({email:doctor}, function (err, found) {
		if (found) done(true);
		else done(false);
	});
}