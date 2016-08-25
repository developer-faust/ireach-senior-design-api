var mongoose = require('mongoose');
var Patients = require('../models/Patients');
var Data = require('../models/Data');
var passport = require('passport');

var cleanString = require('../helpers/cleanString');

var authController = require('../helpers/auth');

module.exports = function (app) {

	/* data GET calls for patients */
	// get all data entries from requesting patient
	app.get('/data', authController.isPatient, function (req, res, next) {
		Data.find({ email: req.user.email }, function (err, data) {
			if (err) return next(err);
			if (!data) return res.status(404).json({"Error":"either bad timestamp or user does not exist"});

			return res.json(data);
		});
	});

	// get specific data entry at :timestamp from requesting patient
	app.get('/data/:timestamp', authController.isPatient, function (req, res, next) {
		Data.findOne({ email: req.user.email, created: req.params.timestamp }, function (err, data) {
			if (err) return next(err);
			if (!data) return res.status(404).json({"Error":"either bad timestamp or user does not exist"});

			return res.json(data);
		});
	});
	/* end of data GET calls for patients */

	/* data GET calls for doctors to use */
	// get all data entries from requesting patient
	app.get('/doctor/data/:patient', authController.isDoctor, function (req, res, next) {
		Patients.findOne({ email: req.params.patient, doctor: req.user.email }, function (err, patient) {
			if (!patient) return res.status(401).end();
			Data.find({ email: patient.email }, function (err, data) {
				if (err) return next(err);
				if (!data) return res.status(200).json(data);

				return res.status(200).json(data);
			});
		});
	});

	// get specific data entry at :timestamp from requesting patient
	app.get('/doctor/data/:patient/:timestamp', authController.isDoctor, function (req, res, next) {
		Patients.findOne({ email: req.params.patient, doctor: req.user.email }, function (err, patient) {
			if (!patient) return res.status(401).end();
			Data.findOne({ email: req.user.email, created: req.params.timestamp }, function (err, data) {
				if (err) return next(err);
				console.log(data);
				if (!data) return res.status(404).json({"Error":"either bad timestamp or user does not exist"});

				return res.json(data);
			});
		});
	});
	/* end of data GET calls for doctors to use */

	/* data GET calls for admins */
	// get all data entries from requesting patient
	app.get('/admin/data/:patient', authController.isAdmin, function (req, res, next) {
		Data.find({ email: req.params.patient }, function (err, data) {
			if (err) return next(err);
			if (!data) return res.status(404).json({"Error":"either bad timestamp or user does not exist"});

			return res.json(data);
		});
	});

	// get specific data entry at :timestamp from requesting patient
	app.get('/admin/data/:patient/:timestamp', authController.isAdmin, function (req, res, next) {
		Data.findOne({ email: req.params.patient, created: req.params.timestamp }, function (err, data) {
			if (err) return next(err);
			if (!data) return res.status(404).json({"Error":"either bad timestamp or user does not exist"});

			return res.json(data);
		});
	});
	/* end of data GET calls for admins */

	// post all data entries from requesting patient
	// this functionality is not for final project and will be removed once machine learning alg is working
	app.post('/data', authController.isPatient, function (req, res, next) {
		var data = req.body;
		data.email = req.user.email;

		if (data.entered) delete data.entered;

		var new_data = new Data(data);
		new_data.save(new_data, function (err, data) {
			if (err) {
				if (err instanceof mongoose.Error.ValidationError) {
					return res.status(404).json(err.message);
				}
				return res.status(404).json(err.message);
				//return next(err);
			}
			return res.status(201).json(data);
		});
	});

	// delete all data entries from requesting patient
	app.delete('/data/:timestamp', authController.isPatient, function (req, res, next) {
		Data.findOne({ created: req.params.timestamp, email: req.user.email }, function (err, found) {
			if (err) return next(err);

			found.remove();
			return res.json(found);
		});
	});
}