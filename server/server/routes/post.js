const allowOrigin = require("../corsPolicyHandler.js");
const storageHandler = require("../../storage/storageHandler.js");

const post_requests = {
  "/save-state": function saveState(req, res){
    const gameState = [];

    req.on("data", chunk => {
      gameState.push(chunk);
    });

    req.on("end", () => {
      storageHandler.writeFileTo(gameState);
    });

    res.statusCode = 201;
    allowOrigin(res);
    res.end("Success saved!");
  },
};

module.exports = post_requests;