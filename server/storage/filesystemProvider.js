const fs = require("fs");

class FileSystemProvider {
  constructor() {}

  write(data) {
    fs.writeFile(`${__dirname}/gameState.json`, data, "utf8", err => {
      if (err) {
        return console.log(err);
      }
      console.log(`Successfully saved!`);
    });
  }

  read(callback) {
    fs.readFile(`${__dirname}/gameState.json`, "utf8", (err, data) => {
      if (err) {
        return console.log(err);
      }
      callback(data);
    });
  }
}

module.exports = fileSystemProvider = new FileSystemProvider();