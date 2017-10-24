const express = require('express')
var mysql = require('mysql')
const app = express()
var xss = require('xss')
var bodyParser = require('body-parser')
var fs = require('fs')
'use strict'
var crypto = require('crypto')
var cookieParser = require('cookie-parser')
const request = require('request')
var session = require('client-sessions')
const winston = require('winston')
winston.level = 'debug'
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new (winston.Logger)({
	transports: [
		new (winston.transports.File)({
			name: 'full_log',
			timestamp: tsFormat,
			colorize: true,
			filename: './logs/pickem.log',
			level: 'info'
		}),
		new (winston.transports.File)({
			name: 'error_log',
			timestamp: tsFormat,
			colorize: true,
			filename: './logs/errors.log',
			level: 'error'
		}),
		// colorize the output to the console
		new (winston.transports.Console)({
			name: 'loggerconsole',
			timestamp: tsFormat,
			colorize: true
		})
	]
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
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
	sqlConn.connect(function(err) {
		if(err)
			logger.error("Error connecting to database")
		else
			logger.info("Connected to database")
	})
})

app.use(session({
	cookieName: 'session',
	secret: getRandomString(128),
	duration: 30*60*1000,
	activeDuration: 5*60*1000,
	user: ""

}))
app.use('/public',express.static(__dirname + '/public'))

app.use(function(req,res,next) {

	if(req.session) {
		req.user = req.session.user
		req.sessionToken = req.session.sessionToken
		res.locals.user = req.session.user
		if(req.session.sesh && req.session.expiresi && req.session.sessionToken) {
			var cookieExp = new Date(req.session.expires)
			if(cookieExp.getTime() < new Date(Date.now()).getTime()) {
				delete req.session.sesh;
				delete req.session.sessionToken;
			}	

		}
	}
	next()
})

// Add headers
/*app.use(function (req, res, next) {

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
*/
app.get('/',function(req,res) {
	res.redirect('/Login/');
})

function isValidKey(key) {
	if(key !== 'UserName' && key !== 'Week')
		return true
	return false
}

function getIP(req) {
	var inSplit = req.ip.split(":")
	var ip = inSplit[inSplit.length-1]
	return ip
}

function logError(action,err,user,ip) {
	var message = action
	if(user)
		message += " Username='" + user + "'"
	if(ip)
		message += " IPAddress='" + ip + "' "
	if(err)
		message += "Error Message - " + err;
	logger.error(message)

}

app.post('/SendPicks/',requireLogon, function(req,res){
	var ip = getIP(req)
	logger.info("/SendPicks/: Initiated: User: " + req.user + " IPAddress: " + ip);

	var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
	var week = parseInt(req.body.Week)
	var userName = req.user

	sqlConn.query("USE pickem;",function(err,result){
		if(err)
			logError('/SendPicks/',err,req.user,ip)


		for(var key in req.body){
			if(!isValidKey(key))
				continue
			var gameKey = key
			var winnerKey = req.body[key]
			insertValidGamePick(ip,timestamp,week,userName,gameKey,winnerKey)
			//insertPicks(ip,timestamp,week,userName,gameKey, winnerKey)
		}
		res.redirect('/Pickem/')
	})
})

function insertPicks(ip, timestamp, week, userName, gameKey, winnerKey) {

	var sql = 'SELECT * FROM RecentPicks WHERE Week='+ week +' AND UserName=\'' + userName+ '\' AND GameKey=\'' + gameKey + '\';';
	sqlConn.query(sql,function(err,result) {
		if(err)
			logError('insertPicks()',err,userName,ip)
		var existingEntryLen = result.length;

		sql = 'INSERT INTO Picks (Timestamp,IPAddress,Week,UserName,GameKey,WinnerKey) VALUES (\'' + timestamp + '\',\''+ip+'\',\''+week + '\',\'' + userName + '\',\'' + gameKey + '\',\'' + winnerKey + '\');';

		sqlConn.query(sql, function(err, result) {
			if(err)
				logError('insertPicks()',err,userName,ip)
			insertRecentPicks(ip, timestamp, week, userName, gameKey, winnerKey,existingEntryLen)	
			/*
			var pickID;
			sqlConn.query("SELECT PickID From Picks WHERE UserName='" + userName + "' AND Week=" + week + " AND GameKey='" + gameKey + "' AND WinnerKey='" + winnerKey + "' ORDER BY PickID DESC LIMIT 1;", function(err, result) {
				if(err)
					logError('insertPicks()',err,userName,ip)
				else {
					pickID = result[0].PickID;
					logger.info('Pick inserted PickID: ' + pickID)
					if(existingEntryLen > 0) {
						sql = 'UPDATE RecentPicks SET PickID=\'' + pickID + '\' WHERE GameKey=\'' + gameKey + '\' AND UserName=\'' + userName + '\' AND Week=' + week + ';';
					}
					else
						sql = 'INSERT INTO RecentPicks(PickID,Week,GameKey,UserName) VALUES(' + pickID + ',' + week + ',\'' + gameKey + '\',\'' + userName + '\');'
					sqlConn.query(sql,function(err,result) {
						if(err)
							logError('insertPicks()',err,userName,ip)
						else
							logger.info("RecentPick inserted PickID: " + PickID)
					})
				}
			})*/
		})
	})
}

function insertRecentPicks(ip, timestamp, week, userName, gameKey, winnerKey,existingEntryLen) {
	var pickID;
	sqlConn.query("SELECT PickID From Picks WHERE UserName='" + userName + "' AND Week=" + week + " AND GameKey='" + gameKey + "' AND WinnerKey='" + winnerKey + "' ORDER BY PickID DESC LIMIT 1;", function (err, result) {
		if (err)
			logError('insertPicks()', err, userName, ip)
		else {
			pickID = result[0].PickID;
			logger.info('Pick inserted PickID: ' + pickID)
			if (existingEntryLen > 0) {
				sql = 'UPDATE RecentPicks SET PickID=\'' + pickID + '\' WHERE GameKey=\'' + gameKey + '\' AND UserName=\'' + userName + '\' AND Week=' + week + ';';
			} else
				sql = 'INSERT INTO RecentPicks(PickID,Week,GameKey,UserName) VALUES(' + pickID + ',' + week + ',\'' + gameKey + '\',\'' + userName + '\');'
			sqlConn.query(sql, function (err, result) {
				if (err)
					logError('insertPicks()', err, userName, ip)
				else
					logger.info("RecentPick inserted PickID: " + pickID)
			})
		}
	})

}


app.post("/GetPicks/",requireLogon,function(req,res) {

	var sql = "SELECT * FROM Picks as p WHERE p.UserName = '" +req.user + "' AND p.Week = " + req.body.Week + ";";
	var ip = getIP(req)
	logger.log('/GetPicks/: UserName: ' + req.user + 'IPAddress: ' + ip)
	sqlConn.connect(function(err){
		if(err)
			logError('/GetPicks/',err,req.user,ip)
		var sqlResponse = sqlConn.query(sql,function(err,result){


			if(err){
				logError('/GetPicks/',err,req.user,ip)
				res.send("err")
			}
			else
				res.send(result)
		})
	})

})
app.get("/GetRecentPicks/", requireLogon, function(req,res) {
	if(req.query.UserName && req.query.Week){
		getRecentPicks(req.query.UserName, req.query.Week, res)
		logger.info("/GetRecentPicks: UserName: '" + req.user + "' IPAddress: '" + getIP(req) +"' Search for: Username: '" + req.query.UserName +"' Week: " + req.query.Week + "" )
	}
	else
		logError('/GetRecentPicks/','Invalidy parameters',req.user,getIP(req))
})

app.post("/GetRecentPicks/", requireLogon, function(req,res) {
	getRecentPicks(req.user, req.body.Week,res)
})

function getRecentPicks(UserName, Week, res) {


	sqlConn.query("USE pickem;", function(err,result) {
		if(err)
			logger.error("Err: " + err + " selecting using table");
		var sql = "SELECT p.TimeStamp, p.Week, p.PickID, p.GameKey, p.WinnerKey, p.UserName FROM RecentPicks as rp INNER JOIN Picks as p ON p.PickID = rp.PickID WHERE rp.UserName='" + UserName + "' AND rp.Week=" + Week + ";"
		sqlConn.query(sql,function(err,result){
			if(err)
				logError('getRecentPicks()',err,UserName)

			logger.info("getRecentPicks: Recent picks retrieved UserName: '" + UserName + "' Week=" + Week)
			res.send(result);
			return result;
		})
	})
}
app.get("/GetAllUsers/", function(req,res) {

	sqlConn.query("USE pickem;")
	var sql = "SELECT DISTINCT UserName FROM Picks;"
	logger.info("/GetAllUsers/ - Called by: " + req.user + " IPAddress: " + getIP(req))
	var sqlResponse = sqlConn.query(sql,function(err,result) {
		if(err){
			logError('/GetAllUsers/',err,req.user,getIP(req))
			res.send("err")
		}
		else
			res.send(result)
	})
})

app.get('/Login/',function(req,res) {
	logger.info("Visitor on Login page - IPAddress: " + getIP(req))
	res.sendFile('/Login/login.html', {root: __dirname })
})

app.get('/Register/',function(req,res) {
	logger.info('Visitor on Register page IPAddress: ' + getIP(req))
	res.sendFile('/Register/register.html', {root: __dirname })
})

app.get('/Pickem/Picks/',requireLogon,function(req,res) {
	logger.info("User viewing picks - UserName: " + req.user + " IPAddress: " + getIP(req))
	res.sendFile('/Pickem/picks.html', {root: __dirname })

})

app.post("/Register/", function(req,res) {
	if(!registerUser(req.body)) {
		logError('/Register/',"Registration Error",req.UserName, getIP(req))
		res.redirect('/Register/')
	}
	else {
		logger.info("/Register/ : " + req.UserName + " Registered successfully on IPAddress= " + getIP(req))
		res.redirect('/')
	}
})

function registerUser(details) {
	logger.info("Registering user: UserID: " + details.UserName)
	sqlConn.query("USE pickem;",function(err,result){
		if(err)
			logger.error("Err: " + err + " on selecting db")
		if(!validatePassword(details.Password,details.PasswordConfirm))
			return false

		if(!isValidUserName(details.UserName))
			return false
		logger.info("Valid username")
		if(!isValidEmail(details.EmailAddress))
			return false

		if(isNullOrWhitespace(details.FirstName) || isNullOrWhitespace(details.LastName))
			return false
		logger.info("Creds Verified")
		var sql = "INSERT INTO Users(UserName,PrimaryEmail,FirstName,MiddleName,LastName,BirthDay,BirthMonth,BirthYear) VALUES('" +details.UserName + "','" + details.EmailAddress + "','" + details.FirstName + "','" + details.MiddleName + "','" + details.LastName + "'," + details.BirthDay + "," + details.BirthMonth + "," + details.BirthYear + ");"

		sqlConn.query(sql, function(err,result) {
			if(err) {
				logError('registerUser()',err,details.UserName)
				return false
			}
			sql = "SELECT UserID FROM Users WHERE UserName='" + details.UserName + "';"
			logger.info('User: ' + details.UserName + ' info added')
			sqlConn.query(sql,function(err,result) {
				if(err) {
					logError('registerUser()',err, details.UserName)
					return false
				}
				var creds = saltHashPassword(details.Password)

				sql = "INSERT INTO Credentials(UserID,Salt,Hash) VALUES(" + result[0].UserID + ",'" + creds.salt+ "','" + creds.passwordHash +"');"
				logger.info('Hashed Credentials')
				sqlConn.query(sql, function(err,result) {
					if(err) {
						logger.error('registerUser()',err, details.UserName)
						return false
					}
					logger.info("Hashed Crendtials added\nSuccessful registration")
					return true
				})
			})
		})

	})
}



function authenticateCredsFromDb(userName,password, req, next) {

	var sql = "SELECT Salt, Hash FROM Credentials AS C INNER JOIN Users AS U ON U.UserID = C.UserID WHERE UserName='" + userName + "';"
	sqlConn.query(sql,function(err,result) {
		if(err)
			logError('authenticateCredsFromDb()', err, req.user, getIP(req))
		if(result.length == 0)
			return next(req,false)
		else {
			return next(req,validateUserSignOn(password,result[0].Hash, result[0].Salt))
		}

	})
}

function validateUserSignOn(userPassword, passwordHash, salt) {
	var userHashed = sha512(userPassword, salt).passwordHash;

	if(userHashed === passwordHash) {
		logger.info("Valid creds")
		return true
	}

	logError('validateUserSignOn()',"Invalid creds")
	return false
}

function isValidEmail(email) {
	return true
}

function isValidUserName(userName) {
	return true
	sqlConn.query("SELECT * FROM Users WHERE UserName='" + userName+ "';", function(err,result) {
		if(err)
			logError('isValidUserName()',err,userName)
		logger.info(result.length > 0 ? "Invalid UserName" : "Valid username")
		return !(result.length > 0)
	})
}

function isNullOrWhitespace(val) {
	if(!val)
		return true
	if(val === "")
		return true

	return false
}

function validatePassword(password,passwordConfirm) {
	if(password !== passwordConfirm || password === "")
		return false
	return true
}

function isSafeTableFile(tableFile) {
	if(!tableFile)
		return false
	if(tableFile.indexOf('/') > -1 || tableFile.indexOf('\\') > -1)
		return false
	return true
}

app.get('/Pickem/', requireLogon, function(req,res){
	if(!isNullOrWhitespace(req.query.tableFile)){
		if(isSafeTableFile(req.query.tableFile)) 
			res.sendFile('/Pickem/' + req.query.tableFile, {root: __dirname })	
		else {
			logError('/Pickem/','Potentially harmful request on query string, tableFile=\'' + req.query.tableFile + '\'')
			res.sendFile('/Pickem/pickem.html', {root: __dirname })
		}
	}
	else
		res.sendFile('/Pickem/pickem.html', {root: __dirname })

})

app.get("/Logout/", function(req,res) {
	var user=req.user;
	var ip = getIP(req)
	req.session.reset()
	logger.info("User Logged Out - Username='" + user + "' IPAddress=" + ip)
	res.redirect('/')

})

app.post("/Login/",function(req,res) {
	logger.info('/Login/ - User attempting logon - UserName=\'' + req.body.UserName + '\' IPAddress= ' + getIP(req) )
	if(!isNullOrWhitespace(req.body.UserName) && !isNullOrWhitespace(req.body.Password)) {	

		sqlConn.query("USE pickem;", function(err,result) {
			if(err)
				logError('/Login/', err, req.body.UserName,getIP(req))

			authenticateCredsFromDb(req.body.UserName, req.body.Password, req, function(req,auth) { 
				if (auth) {
					req.session.user = req.body.UserName

					req.session.sesh = 'pickem'
					req.session.sessionToken = getRandomString(32)
					req.session.expires = (Date.now() + (60*15*1000))
					logger.info("Logging in: User name=" + req.session.user)
					req.user = req.body.UserName
					logger.info('User Authenticated UserName: \'' + req.user + '\' IPAddress: ' + getIP(req))
					res.redirect('/Pickem/')
				}
				else {
					logError('/Login/','Invalid credentials',req.body.UserName, getIP(req))
					res.redirect('/')
				}
			})
		})
	}
	else {
		logError('/Login/', 'Invalid credentials', req.body.UserName, getIP(req))
		res.redirect('/')
	}

})

app.get("/Pickem/Dashboard/",requireLogon,function(req,res) {
	logger.info("/Dashboard/: Username: '" + req.userName + "' IPAddress: " + getIP(req))
	res.sendFile('/Pickem/dashboard.html', {root: __dirname })	


})

app.get('/Pickem/Results/',function(req,res) {
	logger.info("/Pickem/Results: Espn results being retreived week=" + req.query.week + " year=" + req.query.date + " IPAddress: " + getIP(req))
	/*res.redirect(espnAddress)*/
	getEspnResults(req.query.date,req.query.week,res)
})

function getEspnResults(year,week,res,callback) {
	logger.info("getEspnResults() - called")
	var espnAddress='http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?lang=en&region=us&calendartype=blacklist&limit=100&dates=' + year + '&seasontype=2&week=' + week
	request.get(espnAddress,(err, resp, body) => {
		var json = JSON.parse(body)
		if(res)
			res.send(json)
		else if(callback)
			callback(json)
		else
			return json
	})
}

app.get("/Pickem/UpdateGameTimes/",function(req,res){
	/*Disable */
	res.redirect('/')
	return
	logger.info("/Pickem/UpdateGameTimes/ : Username: '" + req.user + "' IPAddress: " + getIP(req))
	sqlConn.query("USE pickem;",function(err,result){
		if(err)
			logError("/Pickem/UpdateGameTinmes/",err,req.user,getIP(req))
		else
			for(var i=1; i<18; i++) {
				getEspnResults(req.query.year,i,null,insertGameTimes)

			}
	})
})

function insertGameTimes(json) {
	for(i=0; i<json.events.length; i++) {
		var sql = "INSERT INTO GameTimes(Week,GameKey,StartTime) VALUES(" + json.week.number + ",'" + json.events[i].competitions[0].competitors[0].team.location + "-" + json.events[i].competitions[0].competitors[1].team.location + "','" + json.events[i].competitions[0].date +"');";
		logger.info("Inserting game time: SQL= " + sql)
		insertGame(sql)
	}
}

function insertGame(sql) {
	sqlConn.query(sql,function(err,result){
		if(err)
			logError("insertGame() - sql=" + sql,err)
		else
			logger.info("Game time inserted successfully")
	})
}

function insertValidGamePick(ip,pickTime,week,userName,gameKey, winnerKey) {
	sqlConn.query("USE pickem;",function(err,result){
		if(err)
			logError("getGamePick()",err)
		else {
			var sql = "SELECT * FROM GameTimes WHERE Week=" + week + " AND GameKey='" + gameKey + "';"
			sqlConn.query(sql,function(err,result) {
				if(err || result.length == 0)
					logError("getGamePick()", err)
				else {
					var pickDateTime = new Date(pickTime)
					var gameDateTime = new Date(result[0].StartTime)
					var millisecondsBeforeStart = 1000*60*30;
					if(pickDateTime.getTime() < (gameDateTime.getTime() - millisecondsBeforeStart)) {
						insertPicks(ip, pickTime, week, userName, gameKey, winnerKey)
						logger.info("insertValidGamePick(): Username: '" + userName + "' IPAddress: " + ip + " PickTime: " + pickTime + " Week: " + week + " gameKey: " + gameKey + " winnerKey: " + winnerKey + " Deadline: " + new Date(gameDateTime.getTime()-millisecondsBeforeStart))
						return true
					}
					else {
						logError("insertValidGamePick()","Game picked after deadline -Username: '" + userName + "' IPAddress: " + ip + " PickTime: " + pickTime + " Week: " + week + " gameKey: " + gameKey + " winnerKey: " + winnerKey + " deadline clean: " + gameDateTime.getTime() +  " Deadline: " + new Date(gameDateTime.getTime()-millisecondsBeforeStart)) 
						return false
					}
				}
			})
		}
	})
}

function requireLogon(req,res,next) {
	if(!req.user)
		res.redirect("/")
	else
		next();
}

/**
 *  * generates random string of characters i.e salt
 *   * @function
 *    * @param {number} length - Length of the random string.
 *     */
var genRandomString = function(length){
	return crypto.randomBytes(Math.ceil(length/2))
		.toString('hex') /** convert to hexadecimal format */
		.slice(0,length);   /** return required number of characters */
};

/**
 *  * hash password with sha512.
 *   * @function
 *    * @param {string} password - List of required fields.
 *     * @param {string} salt - Data to be validated.
 *      */
var sha512 = function(password, salt){
	var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
	hash.update(password);
	var value = hash.digest('hex');
	return {
		salt:salt,
		passwordHash:value
	};
};

function getRandomString(length) { 
	return crypto.randomBytes(Math.ceil(length/2))
		.toString('hex') /** convert to hexadecimal format */
		.slice(0,length);   /** return required number of characters */
}

function saltHashPassword(userpassword) {
	var salt = genRandomString(16); /** Gives us salt of length 16 */
	var passwordData = sha512(userpassword, salt);
	return passwordData;
}

app.listen(port, function() {
	winston.info('Pickem Server running on port ' + port + '...\n')
})

