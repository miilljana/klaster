var MongoClient = require("mongodb").MongoClient;
var express = require("express");
var cors = require("cors");
var app = express();
var router = express.Router();
var url = "mongodb://localhost:27017/";
const path = require("path");
var bodyParser = require("body-parser");
router.use(cors());
router.use(bodyParser.json());

app.use("/", express.static(__dirname + "/static"));

router.get("/", function (req, res) {
  res.sendFile(path.join(`${__dirname}/app.html`));
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
       console.log('okkkk');
      db.close();
    });
  });
});



router.post("/read", (req, res) => {
  console.log("IN POST METHOD !!!!!!!!");
	console.log(req.body);
	var t=req.body.songTitleValue;
	var a=req.body.artistValue;
	var f=req.body.additionalFilters;
	var resultArray = [];
	//prebaruvanje po artist
if (t =="" && a!=""){
	console.log("vo iff")
	 MongoClient.connect(url, function(err, db) {
	  var dbo = db.db("tracks");
	  var mapFunction1 = function() {
                       emit(this.artist, 1);
                   };
var reduceFunction1 = function(key, value) {
                          return Array.sum(value);
                      };
dbo.collection('music').mapReduce(
                     mapFunction1,
                     reduceFunction1,

                     { query:{artist:a},
			out: "map_reduce_example_artist"
		 }
                   )
var cursor = dbo.collection('map_reduce_example_artist').find({_id:a});
    cursor.forEach(function(doc, err) {
	  console.log('the number of songs from this artist is ',doc.value);
    });

//if silimars
if(f=="Similar Songs"){
	var mapFunction1 = function() {
                           for (var idx = 0; idx < this.similars.length; idx++) {
                           var key = this.similars[idx][0];
							if(this.similars[idx][1]>0.60)
							{
                           
						   emit(key,1 );
						   
						   }}
                   };
var reduceFunction1 = function(keyCustId, valuesPrices) {
                          return Array.sum(valuesPrices);
                      };
dbo.collection('music').mapReduce(
                     mapFunction1,
                     reduceFunction1,
                     {query:{artist:a},
		 out: "map_reduce_similar" }
                   )

var max=dbo.collection('map_reduce_similar').find().sort({value:-1}).limit(1);
 max.forEach(function(doc, err) {
	  console.log('Most common song ',doc.value);
	  console.log(doc._id);
	  var track=dbo.collection('music').find({track_id:doc._id});
	   track.forEach(function(doc, err) {
	  console.log("The most common song is:", doc.title);
	  
    });
    });
}
if(f=="Type"){
		var mapFunction1 = function() {
                           for (var idx = 0; idx < this.tags.length; idx++) {
                           var key = this.tags[idx][0];
							if(this.tags[idx][1]==100)
							{
                           
						   emit(key,1 );
						   
						   }}
                   };
var reduceFunction1 = function(keyCustId, valuesPrices) {
                          return Array.sum(valuesPrices);
                      };
dbo.collection('music').mapReduce(
                     mapFunction1,
                     reduceFunction1,
                     {query:{artist:a},
		 out: "map_reduce_type" }
                   )

var max=dbo.collection('map_reduce_type').find().sort({value:-1}).limit(1);
 max.forEach(function(doc, err) {
	  console.log("Type: ",doc._id);
	
    });
	
}
 //*************
    var cursor = dbo.collection('music').find({artist:a});
    cursor.forEach(function(doc, err) {
      resultArray.push(doc);
	  var name=doc.artist;
	  console.log(doc.title);
    }, function() {
		
		
      db.close();
      //console.log(resultArray[0].title);
	  
    });
  });
}
if(t!="" && a!=""){
	 MongoClient.connect(url, function(err, db) {
	  var dbo = db.db("tracks");
	var cursor = dbo.collection('music').find({artist:a,title:t});
    cursor.forEach(function(doc, err) {
      resultArray.push(doc);
	  var name=doc.artist;
	  console.log(name);
    }, function() {
		
		
      db.close();
      console.log(resultArray[0]);
	  
    });
	
});
}
  /*MongoClient.connect(url, function(err, db) {
	  var dbo = db.db("tracks");
	  var mapFunction1 = function() {
                       emit(this.artist, 1);
                   };
var reduceFunction1 = function(key, value) {
                          return Array.sum(value);
                      };
dbo.collection('music').mapReduce(
                     mapFunction1,
                     reduceFunction1,

                     { query:{artist:a},
			out: "map_reduce_example"
		 }
                   )
 //*************
    var cursor = dbo.collection('music').find({artist:a,title:t});
    cursor.forEach(function(doc, err) {
      resultArray.push(doc);
	  var name=doc.artist;
	  console.log(name);
    }, function() {
		
		
      db.close();
      console.log(resultArray[0].title);
	  
    });
  });*/
	//return res.sendStatus(200);
});

//add the router
app.use("/", router);
var server = app.listen(8080, function () {});
console.log("Running at Port 8080");
console.log("dirname", __dirname);
