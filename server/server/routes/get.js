const allowOrigin = require("../corsPolicyHandler.js");
const storageHandler = require("../../storage/storageHandler.js");

const get_requests = {
  "/load-state": function loadState(_req, res) {
    function sendGameState(data) {
      res.statusCode = 200;
      allowOrigin(res);
      res.end(data);
    }

    storageHandler.readFileFrom(sendGameState);
  }
}

module.exports = get_requests;