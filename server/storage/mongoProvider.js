const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
let mongoDB;

class MongoProvider {
  constructor() {
    this.initConnection();
  }

  initConnection() {
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        return console.log(err);
      }
      mongoDB = client.db("chessGame");
    });
  }

  write(data) {
    mongoDB.collection("boards").deleteOne({}, (err, result) => {
      if (err) {
        return console.log(err);
      }
    });
    mongoDB.collection("boards", function (err, collection) {
      if (err) {
        return (console.err);
      }
      collection.insertOne(JSON.parse(data));
    });
  }

  read(callback) {
    mongoDB.collection("boards").find().toArray((err, results) => {
      if (err) {
        return console.log(err);
      }
      callback(JSON.stringify(results[0]));
    });
  }
}

module.exports = mongoProvider = new MongoProvider();