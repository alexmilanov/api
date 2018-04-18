var APImiddlewares = require('./APImiddlewares');
var userProfileMiddlewares = require('./userProfileMiddlewares');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

var express = require('express');

var router = express.Router();

router.route('/register').post(APImiddlewares.register);
router.route('/authenticate').post(APImiddlewares.authenticate);
router.route('*').all(APImiddlewares.checkToken);

router.route('/getAccountData').get(userProfileMiddlewares.getAccountData);


module.exports = router;
