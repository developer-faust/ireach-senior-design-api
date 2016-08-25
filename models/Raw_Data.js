var mongoose = require('mongoose');
var validEmail = require('../helpers/validate/email');
var validDate = require('../helpers/validate/date');
var Data = require('./Data');

var schema = mongoose.Schema({
	email: { type: String, trim: true, required: true, ref: 'Patients', validate: [validEmail,"invalid email"] },
	created: { type: String, required: true, validate: [validDate,"invalid date"] },
	entered: { type: Date, required: true, default: Date() },
	data: { 
		accelerometer: {
			x: [{ type: Number }],
			y: [{ type: Number }],
			z: [{ type: Number }]
		},
		magnetometer: {
			x: [{ type: Number }],
			y: [{ type: Number }],
			z: [{ type: Number }]
		},
		gyroscope: {
			x: [{ type: Number }],
			y: [{ type: Number }],
			z: [{ type: Number }]
		}
	},
	processed: { type: Boolean, required: true, default: false }
});

schema.index({ email: 1, created: 1 }, { unique: true });

// validation script for data since I cannot explicity (or at least don't know how to) call a validation script on sub documents
schema.pre('validate', function (callback, body) {
	if (!(
		"accelerometer"   in this.data &&
		"magnetometer"    in this.data &&
		"gyroscope"       in this.data &&
		"x" in this.data.accelerometer &&
		"y" in this.data.accelerometer &&
		"z" in this.data.accelerometer &&
		"x" in this.data.magnetometer  &&
		"y" in this.data.magnetometer  &&
		"z" in this.data.magnetometer  &&
		"x" in this.data.gyroscope     &&
		"y" in this.data.gyroscope     &&
		"z" in this.data.gyroscope     &&
		(
			this.data.accelerometer.x.length > 0 ||
			this.data.accelerometer.y.length > 0 ||
			this.data.accelerometer.z.length > 0 ||
			this.data.magnetometer.x.length > 0  ||
			this.data.magnetometer.y.length > 0  ||
			this.data.magnetometer.z.length > 0  ||
			this.data.gyroscope.x.length > 0     ||
			this.data.gyroscope.y.length > 0     ||
			this.data.gyroscope.z.length > 0
		)
		)) {

		return callback(new Error("Data was either empty or incomplete"));
	}
	return callback();
});

module.exports = mongoose.model('Raw_Data', schema);