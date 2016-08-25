module.exports = function (age) {
  var re = /\d+/;
  return re.test(age) && age<=105
}