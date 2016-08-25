module.exports = function (str) {
	if (typeof str === 'string' || str instanceof String) {
		return str.trim()
	}
	try {
		new_str = str.toString();
		throw "not convertable";
		return new_str;
	}
	catch (e) {
		console.log(e);
		return ""
	}
}