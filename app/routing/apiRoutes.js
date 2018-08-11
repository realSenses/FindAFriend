var friendData = require("../data/friends");
var randomNames = require("../data/randomNames");

module.exports = function(app) {

  app.get("/api/friends", function(req, res) {
    res.json(friendData);
  });

  app.get("/api/random", function(req, res) {
    res.json(randomNames);
  });

  app.post("/api/friends", function(req, res) {
    console.log(req.body);
    friendData.push(req.body);
    res.json(friendData);
  });
  
};
