/* SETUP */
// Express
var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

PORT = 3021;

// Database
var mysql = require('./dbcon.js');

// Handlebars
var exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({
  extname: ".hbs"
}));
app.set('view engine', '.hbs');

var bodyParser = require('body-parser');
var path = require('path');

app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('port', process.argv[2]);
app.set('mysql', mysql);
app.set('views', path.join(__dirname, "/views/DrinkDatabase"));
app.use('/drinks', require('./drinks.js'));
app.use('/customers', require('./customers.js'));
app.use('/locations', require('./locations.js'));
app.use('/orders', require('./orders.js'));
app.use('/drink-locations', require('./drink-locations.js'));
app.use('/drink-orders', require('./drink-orders.js'));
app.use('/', express.static('public'));

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

/* LISTENER */
app.listen(PORT, function(){
  console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.');
});