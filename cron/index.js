var raw_data_conversion = require('./raw_data_conversion');
var dump_raw_data = require('./dump_raw_data');

module.exports = function() {
	raw_data_conversion();
	dump_raw_data();
}
