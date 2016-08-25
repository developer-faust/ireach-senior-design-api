var mongoose = require('mongoose');
var Creds = require('../models/Creds');
var Doctors = require('../models/Doctors');
var Patients = require('../models/Patients');
var Diets = require('../models/Diets');
var Groups = require('../models/Groups');
var passport = require('passport');

var cleanString = require('../helpers/cleanString');

var authController = require('../helpers/auth');

module.exports = function (app) {
	app.get('/diet', authController.isPatient, function (req, res, next) {
		var email = req.user.email;
		Diets.find({email:email}, function (err, diet_entries) {
			if (err) return next(err);
			if (!diet_entries) return next(null);

			res.json(diet_entries);
		});
	});

	app.get('/diet/:timestamp', authController.isPatient, function (req, res, next) {
		var email = req.user.email;
		Diets.findOne({email:email,created:req.params.timestamp}, function (err, diet_entry) {
			if (err) return next(err);
			if (!diet_entry) return next(null);

			res.json(diet_entry);
		});
	});

	app.post('/diet', authController.isPatient, function (req, res, next) {
		var entry = req.body;
		entry.email = req.user.email;
		new_diet = new Diets(entry);
		new_diet.save(entry, function (err, inserted) {
			if (err) {
				console.log(err);
				if (err instanceof mongoose.Error.ValidationError) {
					return res.json(err.errors);
				}
				return next(err);
			}
			return res.json(inserted);			
		});
	});
	
	app.put('/diet/:timestamp', authController.isPatient, function (req, res, next) {
		var update = {};
		if (req.body.created) update.created = req.body.created;
		if (req.body.foodID) update.foodID = req.body.foodID;
		Diets.findOneAndUpdate(
			{email:req.user.email,created:req.params.timestamp},
			{$set: update},
			{runValidators:true},
			function (err, object) {
				if (err) return next(err);
				return res.json(object);
			});
	});

	app.delete('/diet/:timestamp', authController.isPatient, function (req, res, next) {
		Diets.findOne({email:req.user.email,created:req.params.timestamp}, function (err, diet) {
			if (err) return next(err);

			diet.remove().then(function (removed) {
				return res.json(removed);
			});
		});
	});

	//all diet entries
	app.get('/diet/doctor/:patient_email', authController.isDoctor, function (req, res, next) {
		Patients.findOne({email:req.params.patient_email,doctor:req.user.email}, function (err, patient) {
			if (err) return next(err);
			if (!patient) return res.status(401).send({unauthorized:"this patient has not chosen you as their doctor"});

			Diets.find({email:patient.email}, function (err, diet_entries) {
				if (err) return next(err);
				if (!diet_entries) return res.json({error:"there are no diet entries for "+patient.first_name+" "+patient.last_name});

				res.json(diet_entries);
			});
		});
	});

	//specific diet entry based on timestamp
	app.get('/diet/doctor/:patient_email/:timestamp', authController.isDoctor, function (req, res, next) {
		Patients.findOne({email:req.params.patient_email,doctor:req.user.email}, function (err, patient) {
			if (err) return next(err);
			if (!patient) return res.status(401).send({unauthorized:"this patient has not chosen you as their doctor"});

			Diets.findOne({email:patient.email,created:req.params.timestamp}, function (err, diet_entry) {
				if (err) return next(err);
				if (!diet_entry) return res.json({error:"there are no diet entries for "+patient.first_name+" "+patient.last_name});

				res.json(diet_entry);
			});
		});
	});

	//all diet entries
	app.get('/diet/admin/:patient_email', authController.isAdmin, function (req, res, next) {
		Patients.findOne({email:req.params.patient_email}, function (err, patient) {
			if (err) return next(err);
			if (!patient) return res.status(500).json(new Error("ask jeremy what happened"));

			Diets.find({email:patient.email}, function (err, diet_entries) {
				if (err) return next(err);
				if (!diet_entries) return res.json({error:"there are no diet entries for "+patient.first_name+" "+patient.last_name});

				res.json(diet_entries);
			});
		});
	});

	//specific diet entry based on timestamp
	app.get('/diet/admin/:patient_email/:timestamp', authController.isAdmin, function (req, res, next) {
		Patients.findOne({email:req.params.patient_email}, function (err, patient) {
			if (err) return next(err);
			if (!patient) return res.status(500).json(new Error("ask jeremy what happened"));

			Diets.findOne({email:patient.email,created:req.params.timestamp}, function (err, diet_entry) {
				if (err) return next(err);
				if (!diet_entry) return res.json({error:"there are no diet entries for "+patient.first_name+" "+patient.last_name});

				res.json(diet_entry);
			});
		});
	});
}