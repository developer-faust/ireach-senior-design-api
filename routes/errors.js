
module.exports = function (app) {

	//404s
	app.use(function(req, res, next) {
		res.status(404);

		return res.json(app._router.stack);
	});

	app.use(function(err, req, res, next) {
		//console.error('error at %s\n', req.url, err);
		res.status(500).send('Oops');
	});
}