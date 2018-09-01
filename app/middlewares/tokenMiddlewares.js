/* 
This file contain middlewares related with management of the refresh token
*/

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../../app/config'); // get our config file
var inMemoryStorage = require('../../app/common/inMemoryStorage');

module.exports = {
    token: function(req, res, next) {
        var username = req.body.username || req.query.username;
        var refreshToken = req.body.refreshToken || req.query.refreshToken;
        if(!username) res.json({
            success: false,
            message: "Username is mandatory when refresh token is provided"
        })

        var q = inMemoryStorage.getUsernamePerToken(refreshToken);
        console.log(q)
    }
}
