'use strict';
var express = require('express');
var ejs = require('ejs');
var browserify = require('browserify-middleware');

// Setup express app
var app = express();
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', '.');

// Serve static assets
app.use('/main.js', browserify('main.js', {
	transform: ['babelify']
}));

// Setup the front-end routes
app.get('/', function (req, res) {
	res.render('index');
});

// Start server, once started call done
var server = app.listen(1337, function (err) {
	if (err) {
		return console.error(err);
	}
	console.log('Starting server on port ' + server.address().port);
});
