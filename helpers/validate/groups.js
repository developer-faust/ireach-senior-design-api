var Groups = require('../../models/Groups');
module.exports = function (groups, done) {
	var all = [];
	if (typeof groups === "string") {
		if (groups === "")
			done(true);
		groups = [groups];
	}

	Groups.find(function (err, data) {
		for (var key in data) all.push(data[key]._id);
		
		for (var g in groups) 
			if (all.indexOf(groups[g].toLowerCase()) === -1)
				done(false);
		
		done(true);
	});
}