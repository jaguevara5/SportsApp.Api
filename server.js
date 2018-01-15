//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express();
var router = express.Router();
// Body Parser Middleware
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//Setting up server
 var server = app.listen(process.env.PORT || 80, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
 });

//Initiallising connection string
var dbConfig = {
    user: 'webara',
    password: 'alng.1jDB',
    server: 'sportsdb.ch1r9tnzlz1s.us-east-2.rds.amazonaws.com',
    database: 'maindb'
};

//Function to connect to database and execute query
var executeQuery = function(res, query){

  sql.connect(dbConfig).then(pool => {

    return pool.request()
      .query(query);
  }).then(result => {
    res.send(result.recordset);
    sql.close();
  }).catch(err => {
    console.log('Error while querying database :- ' + err);
    res.sendStatus(500);
    sql.close();
  });

  sql.on('error', err => {
    console.log('Errrrrrrrrrorrrr   ' + err);
    sql.close();
  });

  // app.use('/api', router);

  // sql.connect(dbConfig, function(err) {
  //   if(err) {
  //     console.log('Error while connecting data base:- ' + err);
  //     res.send(err);
  //   } else {
  //     var request = sql.Request();
  //
  //     request.query(query, function(err, res) {
  //       if(err) {
  //         console.log('Error while queryin databse :- + err');
  //         err.send(err);
  //       } else {
  //         res.json(res);
  //       }
  //     });
  //   }
  // });
};

//GET API
app.get('/api/schools', function(req , res){
  var query = 'SELECT * FROM Schools';
  executeQuery (res, query);
});

app.get('/api/school/', function(req , res){
  var query = 'SELECT * FROM Schools WHERE schoolID = ' + req.query.id;
  executeQuery (res, query);
});

app.get('/api/game/:id', function(req , res){
  var query = 'SELECT * FROM Games WHERE gameID = ' + req.params.id;
  executeQuery (res, query);
});

app.get('/api/games/today', function(req , res){
  var query = 'SELECT * FROM Games WHERE gameDay = DATEADD(day, DATEDIFF(day, 0, GETDATE()), 0)';
  executeQuery (res, query);
});

app.get('/api/games/yesterday', function(req , res){
  var query = 'SELECT * FROM Games WHERE gameDay = DATEADD(day, DATEDIFF(day, 1, GETDATE()), 0)';
  executeQuery (res, query);
});

app.get('/api/games/tomorrow', function(req , res){
  var query = 'SELECT * FROM Games WHERE gameDay = DATEADD(day, DATEDIFF(day, -1, GETDATE()), 0)';
  executeQuery (res, query);
});

//POST API
//  app.post("/api/user", function(req , res){
//                 var query = "INSERT INTO [user] (Name,Email,Password) VALUES (req.body.Name,req.body.Email,req.body.Password”);
//                 executeQuery (res, query);
// });
//
// //PUT API
//  app.put("/api/user/:id", function(req , res){
//                 var query = "UPDATE [user] SET Name= " + req.body.Name  +  " , Email=  " + req.body.Email + "  WHERE Id= " + req.params.id;
//                 executeQuery (res, query);
// });
//
// // DELETE API
//  app.delete("/api/user /:id", function(req , res){
//                 var query = "DELETE FROM [user] WHERE Id=" + req.params.id;
//                 executeQuery (res, query);
// });
