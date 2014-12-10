var http = require('http');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoskin = require('mongoskin');

var app = express();
var server = http.createServer(app);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '/public')));

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
  res.render('index', {});
})

server.listen(8080, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("Server listening on %s:%s", host, port);
})
