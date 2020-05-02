const post_requests = require("./routes/post.js");
const get_requests = require("./routes/get.js");

function requestHandler(req) {
  switch(req.method) {
    case "POST": return post_requests[req.url];
    case "GET": return get_requests[req.url];
    default: throw new Error("Wrong request.");
  }
}

module.exports = requestHandler;