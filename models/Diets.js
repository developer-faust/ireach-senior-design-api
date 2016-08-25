var mongoose = require('mongoose');
var validEmail = require('../helpers/validate/email');
var validDate = require('../helpers/validate/date');
var validFood = require('../helpers/validate/name');
var Creds = require('./Creds');
var Patients = require('./Patients');
var Usda = require('./Usda');
var http = require('http');
var fs = require('fs');

var ValidationError = mongoose.Error.ValidationError;

var schema = mongoose.Schema({
	email: { type: String, trim: true, required: true, ref: 'Patients', validate: [validEmail,"invalid email"] },
	created: { type: String, required: true, validate: [validDate,"invalid date"] },
	food: { type: String, trim: true, required: true },
	foodID: { type: String, required: true },
	calories: { type: Number, required: true },
	quantity: { type: Number, required: true }
});

schema.index({email:1, created:1}, {unique: true});

schema.pre('validate', function (callback, body) {
	var user = this;
	if (user.isModified('foodID')) {
		if (user.food) delete user.food
		if (user.calories) delete user.calories
		var options = {
			host: 'api.nal.usda.gov',
			port: 80,
			path: '/ndb/nutrients/?format=json&api_key=EYSVIZjCLeSX9P1PEahJSWpbWUlimEvF3pJ5DNpG&nutrients=208&ndbno='+this.foodID,
			headers: {
				"Content-Type": 'applications/json'
			}
		}
		Usda.find({ foodID: user.foodID }, function (err, found_usda) {
			if (err || found_usda.length===0) {
				var req = http.get(options, function (res) {
					res.setEncoding('utf8');

					res.on('data', function (data) {
						var data = JSON.parse(data);
						user.food = data.report.foods[0].name;
						user.calories = data.report.foods[0].nutrients[0].value * user.quantity

						// enter data into our local database
						var usda = { 
							foodID: user.foodID, 
							calories: data.report.foods[0].nutrients[0].value,
							name: data.report.foods[0].name 
						}
						new_usda = new Usda(usda);
						new_usda.save(function (err, saved) {
							if (err) console.log(err);
						});
					});

					res.on('end', function () {
						callback();
					});
				});

				req.end();
			}
			else {
				user.food = found_usda[0].name;
				user.calories = found_usda[0].calories * user.quantity;
				callback();
			}
		});
	}
	else callback();
});

module.exports = mongoose.model('Diets', schema);