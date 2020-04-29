const fs = require("fs");
const FILE_SYSTEM = "filesystem";
const DATA_BASE = "database";

class StorageHandler {
  constructor() {}

  writeFileTo(gameState, destination = FILE_SYSTEM) {
    switch(destination) {
      case FILE_SYSTEM: this._writeToFileSystem(gameState); break;
      case DATA_BASE: this._writeToDataBase(gameState); break;
      default: throw new Error("Something went wrong while writing");
    }
  }

  readFileFrom(callback, destination = FILE_SYSTEM) {
    switch(destination) {
      case FILE_SYSTEM: return this._readFromFileSystem(callback);
      case DATA_BASE: return this._readFromDataBase();
      default: throw new Error("Something went wrong while reading...")
    }
  }

  _writeToFileSystem(data) {
    fs.writeFile(`${__dirname}/gameState.json`, data, "utf8", err => {
      if (err) {
        return console.log(err);
      }
      console.log(`Successfully saved!`);
    });
  }

  _writeToDataBase(){}

  _readFromFileSystem(callback) {
    fs.readFile(`${__dirname}/gameState.json`, "utf8", (err, data) => {
      if (err) {
        return console.log(err);
      }
      callback(data);
    })
  }

  _readFromDataBase() {}
}

module.exports = storageHandler = new StorageHandler();