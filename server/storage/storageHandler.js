const FILE_SYSTEM = "filesystem";
const DATA_BASE = "database";
const fileSystemProvider = require("./filesystemProvider.js");
const mongoProvider = require("./mongoProvider.js");


class StorageHandler {
  constructor() {
    this.provider = this.getStorageProvider();
  }

  getStorageProvider(destination = DATA_BASE) {
    switch(destination) {
      case FILE_SYSTEM: return fileSystemProvider;
      case DATA_BASE: return mongoProvider;
    }
  }

  writeFileTo(gameState) {
    this.provider.write(gameState);
  }

  readFileFrom(callback) {
    this.provider.read(callback);
  }
}

module.exports = storageHandler = new StorageHandler();