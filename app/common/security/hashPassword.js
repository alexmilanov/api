var crypto = require('crypto');

module.exports.hashPassword = function(password, salt) {

    if(typeof password !== 'string') throw new Error('Password should be string');

    return crypto.createHmac('sha256', salt).update(password).digest('hex');
}