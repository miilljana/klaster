var MongoClient = require("mongodb").MongoClient;
var express = require("express");
var app = express();
var router = express.Router();
var url = "mongodb://localhost:27017/";
const path = require("path");
var bodyParser = require("body-parser");
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));
//app.use(express.urlencoded());
//app.use(express.json());

router.get("/", function (req, res) {
  res.sendFile(
    path.join(
      "C:",
      "Users",
      "Korisnik",
      "Desktop",
      "MongoDB Project" + "/app.html"
    )
  );
  //__dirname : It will resolve to your project folder.
});

router.get("/read", (req, res) => {
  console.log("IN GET METHOD !!!");
  console.log(JSON.stringify(req.body));
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("tracks");
    dbo.collection("music").findOne({}, function (err, result) {
      if (err) throw err;
      res.send(result);
      db.close();
    });
  });
});

router.post("/read", (req, res) => {
  console.log("IN POST METHOD !!!!!!!!");
  console.log({ req });
});

//add the router
app.use("/", router);
var server = app.listen(8080, function () {});
console.log("Running at Port 8080");
