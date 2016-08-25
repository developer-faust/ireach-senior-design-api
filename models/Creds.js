var mongoose = require('mongoose');
var validEmail = require('../helpers/validate/email');
var bcrypt = require('bcrypt-nodejs');

var schema = mongoose.Schema({
	email: { type: String, lowercase: true, unique: true, trim: true, validate: validEmail },
	password: { type: String, required: true },
	created: { type: Date, default: Date.now },
	admin: { type: Boolean, default: false }
});

schema.pre('save', function (callback) {
	var user = this;

	// Break out if the password hasn't changed
	if (!user.isModified('password')) return callback();

	// Password changed so we need to hash it
	bcrypt.genSalt(5, function (err, salt) {
		if (err) return callback(err);

		bcrypt.hash(user.password, salt, null, function (err, hash) {
			if (err) return callback(err);

			user.password = hash;
			callback();
		});
	});
});


schema.methods.verifyPassword = function (password, callback) {
	bcrypt.compare(password, this.password, function (err, isMatch) {
		if (err) return callback(err);
		callback(null, isMatch);
	});
}

module.exports = mongoose.model('Creds', schema);