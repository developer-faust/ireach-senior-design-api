var mongoose = require('mongoose');
var Patients = require('../models/Patients');
var Raw_Data = require('../models/Raw_Data');
var passport = require('passport');

var cleanString = require('../helpers/cleanString');

var authController = require('../helpers/auth');

module.exports = function (app) {
	// get all raw_data entries from requesting patient
	app.get('/raw_data', authController.isPatient, function (req, res, next) {
		Raw_Data.find({ email: req.user.email }, function (err, data) {
			if (err) return next(err);
			if (!data) return invalid(res);

			return res.json(data);
		});
	});

	// get specific raw_data entry at :timestamp from requesting patient
	app.get('/raw_data/:timestamp', authController.isPatient, function (req, res, next) {
		Raw_Data.findOne({ email: req.user.email, created: req.params.timestamp }, function (err, data) {
			if (err) return next(err);
			if (!data) return invalid(res);

			return res.json(data);
		});
	});

	// post all raw_data entries from requesting patient
	app.post('/raw_data', authController.isPatient, function (req, res, next) {
		var raw_data = req.body;
		raw_data.email = req.user.email;

		if (raw_data.entered) delete raw_data.entered;

		var new_raw_data = new Raw_Data(raw_data);
		new_raw_data.save(new_raw_data, function (err, data) {
			if (err) {
				if (err instanceof mongoose.Error.ValidationError) {
					return res.status(404).json(err.errors);
				}
				return res.status(404).send(err);
				//return next(err);
			}
			return res.status(201).json(data);
		});
	});

	// delete all raw_data entries from requesting patient
	app.delete('/raw_data/:timestamp', authController.isPatient, function (req, res, next) {
		Raw_Data.findOne({ created: req.params.timestamp, email: req.user.email }, function (err, found) {
			if (err) return next(err);

			found.remove();
			return res.json(found);
		});
	});

}