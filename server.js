var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./app/models/user');

var validators = require('./validators');
var hash = require('./app/common/security/hashPassword');
var salt = require('./app/common/security/salt');

var port = config.port;

mongoose.connect(config.database);
app.set(config.secret);

app.use(morgan('dev'));

app.use(bodyParser.json()).use(bodyParser.urlencoded({extended: false}));

app.post('/register', (req, res) => {
    if(!req.body.username || !validators.validateUsername(req.body.username)) {
        res.json({
            error: 'Invalid username!',
            success: false
        });
    }

    if(!req.body.password || !validators.validatePasswordLength(req.body.password)) {
        res.json({
            error: 'Password should be at least 6 symbols long',
            success: false
        });
    }

    let generatedSalt = salt.generateSalt();
    let password = hash.hashPassword(req.body.password, generatedSalt);

    var user = new User({
        username: req.body.username,
        password: password,
        isAdmin: false,
        salt: generatedSalt
    });



    user.save((err)=>{
        if(err) throw err;

        console.log("User successfully created");
        res.json({
            error: null,
            success: true
        });
    });
});

app.listen(port);
console.log('API is started');