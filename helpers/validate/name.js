module.exports = function (name) {
  var re = /^[A-z ]+$/;
  return re.test(name);
}