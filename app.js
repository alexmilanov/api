var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./app/config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model
var apiRoutes = require('./app/middlewares/routes')

var port = config.port;

mongoose.connect(config.database);
mongoose.set('useFindAndModify', false);
app.set('secret', config.secret);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use('/api', apiRoutes)

app.listen(port);

