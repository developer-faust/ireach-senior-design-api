var mongoose = require('mongoose');
var validPatient = require('../helpers/validate/patient');
var validDate = require('../helpers/validate/date');
var validActivity = require('../helpers/validate/activity');

var schema = mongoose.Schema({
	email: { type: String, trim: true, required: true, ref: 'Patients', validate: [validPatient,"invalid email"] },
	created: { type: String, required: true, validate: [validDate,"invalid date"] },
	activity: { type: String, required: true, validate: [validActivity,"invalid activity"] },
	duration: { type: Number, required: true },
	calories_burned: { type: Number, required: true }
});

schema.index({email:1, created:1}, {unique: true});

schema.post('remove', function (doc) {
	var Raw_Data = mongoose.model('Raw_Data');
	Raw_Data.remove({ created: doc.timestamp, email: doc.email }).exec();
});

module.exports = mongoose.model('Data', schema);