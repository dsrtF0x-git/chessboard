const http = require("http");
const requestHandler = require("./requestHandler.js");

const port = process.env.PORT || 4444;

const server = http.createServer((req, res) => {

  requestHandler(req)(req, res);
  
});


server.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});