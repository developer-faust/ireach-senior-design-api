module.exports = function (sex) {
  var re = /(male|female)/i;
  return re.test(sex);
}