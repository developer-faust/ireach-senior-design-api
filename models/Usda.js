var mongoose = require('mongoose');

var schema = mongoose.Schema({
	foodID: { type: String, required: true, unique: true },
	name: { type: String, trim: true, required: true },
	calories: { type: Number, required: true }
});

schema.pre('validate', function (done) {
	var self = this;
	mongoose.models.Usda.remove({ foodID: self.foodID }, function (err, found) {
		if (err) console.log(err);
		done();
	});
});

module.exports = mongoose.model('Usda', schema);