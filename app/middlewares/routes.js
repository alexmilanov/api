var APImiddlewares = require('./APImiddlewares');
//var tokenMiddlewares = require('./tokenMiddlewares')
var userProfileMiddlewares = require('./userProfileMiddlewares');

var express = require('express');

var router = express.Router();

router.route('/register').post(APImiddlewares.register);

router.route('/authenticate').post(APImiddlewares.authenticate);
//router.route('/authenticate/token').post(tokenMiddlewares.token);
router.route('*').all(APImiddlewares.checkToken);

router.route('/getAccountData').get(userProfileMiddlewares.getAccountData);

module.exports = router;
