//Change database name in url variable.
//Change upload directory in uploadDirectory variable.
var express = require('express'),
	http = require('http'),	
	catch_url='/flyttaapi/getinfo/',
	mongodb = require('mongodb'),
	MongoClient = mongodb.MongoClient,
	url = 'mongodb://localhost:27017/testdata',
	_db;
	
var app = express();
	start_model();

//Connect to Database
function connect(){	
	MongoClient.connect(url, function(err, db) {
   if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
   } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', url);
	  _db=db;
	}
	});	
}

//Start server on port 3000
function start_model(){
	//Asynchronously connect to database and starts server on port 3000
	connect();
	server = http.createServer(app);
	//Started server on port 3000
	server.listen(3000, '127.0.0.1');
	server.on('listening', function() {
	 console.log('Express server started on port %s at %s', server.address().port, server.address().address);
	});	
	app.post(catch_url, function(req, res) {		
		parse_data(req,res);
	});
}

//parse JSON data
function parse_data(req,res){
	var jsonString = '';
    req.on('data', function (data) {
        jsonString += data;
    });
    req.on('end', function () {
		try {
			var jsonObject = JSON.parse(jsonString);
			res.end("Data accepeted");
			addIntoDatabase(jsonObject);
		} catch (e) {
			console.log(e);
			res.end("Check if data is in valid format");
		}
	});	
}

//Add Data into database				
function addIntoDatabase(jsonObject) {
	var collection = _db.collection('users');
	collection.insert(jsonObject, function(err, result) {
		if (err) {	console.log(err);
		} else {
			console.log('Inserted documents into the "users" collection.');
		}
	});
}