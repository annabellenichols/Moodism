var http = require('http');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoskin = require('mongoskin');
var Promise = require('promise');

var app = express();
var server = http.createServer(app);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, 'public/images')));

var db = mongoskin.db('mongodb://moodist:moodism4ever@ds061620.mongolab.com:61620/output', {safe: true});
var collections = { tokens: db.collection('tokens') };

app.use(function(req, res, next) {
	if (!collections.tokens) {
		return next(new Error('No tokens collection.'));
	}
	req.collections = collections;
	next();
})

app.get('/', function(req, res){
  res.render('homepage', {});
})

app.get('/homepage', function(req, res){
  res.render('homepage', {});
})

app.get('/question', function(req, res){
  res.render('question', {});
})

app.get('/questions', function(req, res){
  res.render('questions', {});
})


app.get('/final', function(req, res){
  res.render('final', {});
})

server.listen(8080, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("Server listening on %s:%s", host, port);
})

var io = require('socket.io')(server);

io.on('connection', function (socket) {
	socket.on('downloadToken', function (data) {

        token_fun = function() {
			return new Promise(function(resolve, reject) {
			    collections.tokens.findOne({type: data.results.media,
                                         mood: data.results.mood,
                                         year: data.results.time},
                                        {_id: 0}).toArray(function(err, result) {
			      if (err) {
			        console.log('an error occurred:', err);
			        reject(err);
			      } else {
			        console.log('the token is:', result);
			        resolve(result);
			      }
			    });
			});
		};

		var token;

		selected_token_fun().then(function(result) {
			var selected_token =  JSON.stringify(result);
			token = JSON.parse( selected_token );
			socket.emit('displayToken', token);
		}, function(err) {
			throw err;
		});

  	});
})
