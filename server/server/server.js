const http = require("http");
const storageHandler = require("../storage/storageHandler.js");

const port = process.env.PORT || 4444;

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/save-state") {
    const gameState = [];

    req.on("data", chunk => {
      gameState.push(chunk);
    });

    req.on("end", () => {
      storageHandler.writeFileTo(gameState);
    });

    res.statusCode = 201;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end("Success saved");

  } else if (req.method === "GET" && req.url === "/load-state") {

    function sendGameState(data) {
      res.statusCode = 200;
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.end(data);
    }

    storageHandler.readFileFrom(sendGameState);
  }
});


server.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});