var Raw_Data = require('../models/Raw_Data');
var Data = require('../models/Data');

var crontab = require('node-crontab');
var Q = require('q');
var moment = require('moment');
var child_process = require('child_process');

var global_funcs = {};

global_funcs.convert_data = function () {
	var deferred = Q.defer();
	Raw_Data.find({processed: false}, function (err, found_raw_data_entries) {
		var all = [];
		for (var each in found_raw_data_entries) {
			all.push(global_funcs.convert(found_raw_data_entries[each]));
			found_raw_data_entries[each].processed = true;
		}
		Q.all(all).then(function (processed_data) {
			global_funcs.enter_processed_data(processed_data).then(function (success) {
				deferred.resolve(success);
			});
		});
	});
	return deferred.promise;
}

global_funcs.convert = function (raw_data_entries) {
	var deferred = Q.defer();
	console.log(child_process);
	console.log(child_process.exec);
	child_process.exec('touch newfile'/*'nodejs '+process.cwd()+'/convert.js '+raw_data_entries['data']*/, function (err, stdout, stderr) {
		//raw_data_entries['data'] = stdout;
		deferred.resolve("raw_data_entries");
	});
	return deferred.promise;
}

global_funcs.enter_processed_data = function (processed_data) {
	var deferred = Q.defer();
	var all = [];
	for (var each in processed_data) {
		var data = new Data({
			email: processed_data[each].email,
			created: processed_data[each].created,
			data: processed_data[each]['data']			
		});
		all.push(data.save());
	}
	Q.all(all)
	.then(function (success) {
		deferred.resolve(success);
	});

	return deferred.promise;
}

module.exports = function() {
	var jobId = crontab.scheduleJob("* * * * *", function(){
	  child_process.exec('cd 421_ClassifyCron; java -classpath .:libs/mongo-java-driver-2.13.3.jar:libs/weka.jar com.ireach.ClassifyCron', function (err, stdout, stderr) {
	    if (err) console.log(err);
	  });
	/* 
	  global_funcs.convert_data().then(function (success) {
	  	console.log('Raw Data processed and entered at '+Date());
	  });*/
	});
}
