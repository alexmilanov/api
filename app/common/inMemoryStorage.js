var redis = require('redis');
var client = redis.createClient();
var config = require('../config');

module.exports = {
    setUsernameAndToken: function(token, username) {
        client.set(token, username);
        client.expireat(token, config.redis.expire);
    },
    getUsernamePerToken: function(token) {
        client.get(token, (err, response) => {
            if(err) throw err;

            return response;
        })
    }
};