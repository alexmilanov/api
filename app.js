var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var config = require('./app/config'); // get our config file
var apiRoutes = require('./app/middlewares/routes');
var cluster = require('cluster');

var port = config.port;

mongoose.connect(config.database);

app.set('secret', config.secret);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use('/api', apiRoutes);

app.listen(port);