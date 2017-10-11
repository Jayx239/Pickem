const express = require('express')
var mysql = require('mysql')
const app = express()
var xss = require('xss')
var bodyParser = require('body-parser')
var fs = require('fs')
app.use(bodyParser.urlencoded({extended: true}))
port = 3656

var sqlCreds = "";
var sqlConn = null;
fs.readFile('db/creds.conf','utf8', function(err,contents) {
	sqlCreds = JSON.parse(contents).Credentials


 sqlConn = mysql.createConnection({
	host: sqlCreds.host,
	user: sqlCreds.user,
	password: sqlCreds.password
})
})
// Add headers
app.use(function (req, res, next) {

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', 'http://173.49.219.13');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

app.get('/',function(req,res) {
	res.send('Test');
})

function isValidKey(key) {
	if(key !== 'UserName' && key !== 'Week')
		return true
	return false
}

app.post('/SendPicks/', function(req,res){
	console.log(req.body);
	var ipSplit = req.ip.split(":")
	var ip = ipSplit[ipSplit.length-1]
	console.log(ip)
	var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
	var week = parseInt(req.body.Week)
	var userName = req.body.UserName
	console.log(req.body.Week)

	sqlConn.connect(function(err) {
		if(err)
			console.log("Error connecting to db\n")
		console.log("Connection made")
		sqlConn.query("USE pickem;")

		for(var key in req.body){
			if(!isValidKey(key))
				continue
			var gameKey = key
			var winnerKey = req.body[key]
			var sql = 'SELECT * FROM RecentPicks WHERE Week='+ week +' AND UserName=\'' + userName+ '\' AND GameKey=\'' + gameKey + '\';';
			sqlConn.query(sql,function(err,result) {
				if(err)
					console.log("Err: " + err + "\nThrown on SELECT RecentPicks");
			var existingEntryLen = result.length;

			sql = 'INSERT INTO Picks (Timestamp,IPAddress,Week,UserName,GameKey,WinnerKey) VALUES (\'' + timestamp + '\',\''+ip+'\',\''+week + '\',\'' + userName + '\',\'' + gameKey + '\',\'' + winnerKey + '\');';
			console.log(sql)
			sqlConn.query(sql, function(err, result) {
				if(err)
					console.log("Err: " + err + "\nThrown on Picks insert")
				console.log("Entry inserted")
				if(existingEntryLen > 0) {
					sql = 'UPDATE RecentPicks SET PickID=LAST_INSERT_ID() WHERE GameKey=\'' + gameKey + '\' AND UserName=\'' + userName + '\' AND Week=' + week + ';';
				}
				else
					sql = 'INSERT INTO RecentPicks(PickID,Week,GameKey,UserName) VALUES(LAST_INSERT_ID(),' + week + ',\'' + gameKey + '\',\'' + userName + '\');'
				sqlConn.query(sql,function(err,result) {
					if(err)
						console.log("Err: " + err + "\nThrown on RecentPicks insert")

				})
			})
		})
		}
		//res.send("Success")

	})

	res.send("Error")
})

app.post("/GetPicks/",function(req,res) {

	var sql = "SELECT * FROM Picks as p WHERE p.UserName = '" +req.body.UserName + "' AND p.Week = " + req.body.Week + ";";
	//if(req.body.Latest === "on")
		sql = "CALL user_latest_picks('" + req.body.UserName + "', " +req.body.Week +");"
	console.log(sql)

	console.log("Sql created\n")
	sqlConn.connect(function(err){
		//sqlConn.query("USE pickem;")
		if(err)
			console.log("Error connection to db\n")
		var sqlResponse = sqlConn.query(sql,function(err,result){


			console.log(sqlResponse)
			if(err)
				res.send("err")
			else
				res.send(result)
		})
	})

})

app.get("/GetAllUsers/", function(req,res) {

	sqlConn.connect(function(err) {
		sqlConn.query("USE pickem;")
		var sql = "SELECT DISTINCT UserName FROM Picks;"
		var sqlResponse = sqlConn.query(sql,function(err,result) {
			if(err)
				res.send("err")
			else
				res.send(result)
		})
	})

})

app.listen(port, function() {
	console.log('Pickem Server running on port ' + port + '...\n')
})

