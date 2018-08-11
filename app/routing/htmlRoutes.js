var path = require("path");

module.exports = function(app) {

  app.get('/', function (req, res) {
    res.render('home');
  });
  
  app.get("/home", function(req, res) {
    res.render('home');
  });

  app.get("/survey", function(req, res) {
    res.render('survey');
  });

  app.get("/test", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/bulma-example-template.html"));
  });


  // If no matching route is found default to home
  app.get("*", function(req, res) {
    res.render('home');
  });

};
