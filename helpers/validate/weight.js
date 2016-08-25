module.exports = function (weight) {
  var re = /\d+/;
  return re.test(weight);
}