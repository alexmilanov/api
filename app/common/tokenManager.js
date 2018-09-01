//This module create and manage the needed structure which should be returned when user is authenticated
var jwt    = require('jsonwebtoken');
var randToken = require('rand-token')
var config = require('../../app/config');

module.exports.getTokenStructure = function(payload = {}, request) {
    let token = jwt.sign(payload, request.app.get('secret'), {
        expiresIn: config.tokenValidityInSeconds
    });

    let refreshToken = randToken.uid(256)

    return {
        success: true,
        message: 'Done',
        token: token,
        refreshToken: refreshToken,
        issuedAt: Math.round((new Date()).getTime() / 1000),
        validity: config.tokenValidityInSeconds
    }
    
}