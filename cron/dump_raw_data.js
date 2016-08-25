var Raw_Data = require('../models/Raw_Data');
var Data = require('../models/Data');

var crontab = require('node-crontab');
var Q = require('q');
var moment = require('moment');
var child_process = require('child_process');

var global_funcs = {};
var now = new Date();

global_funcs.dump_data = function () {
	var deferred = Q.defer();
	child_process.exec(process.cwd()+'/mongodump_raw_data.sh '+Date().replace(/\ /g,"_").match(/\w+?:\d\d/i)[0], function (err, stdout, stderr) {
		deferred.resolve(err || stdout || stderr);
	});
	return deferred.promise;
}

module.exports = function() {
	var jobId = crontab.scheduleJob("0 0 * * *", function(){ 
	  global_funcs.dump_data().then(function (success) {
	  	console.log(process.cwd()+'/mongodump_raw_data.sh '+Date().replace(/\ /g,"_").match(/\w+?:\d\d/i)[0]);
	  	console.log('Raw Data dumped at '+Date()+': successful: '+success);
	  });
	});
}