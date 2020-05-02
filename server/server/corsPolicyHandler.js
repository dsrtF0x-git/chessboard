function allowOrigin(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
}

module.exports = allowOrigin;