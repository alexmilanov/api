var config = require('../../config');
var crypto = require('crypto');

module.exports.getSalt = function() {
    return crypto.randomBytes(Math.ceil(config.saltLength/2)).toString('hex').slice(0, config.saltLength);
}