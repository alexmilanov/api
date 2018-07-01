var redis = require('redis');
var client = redis.createClient();

client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

var config = require('../config');

module.exports = {
    setUsernameAndToken: function(token, username) {
        client.set(token, username);
        //client.expireat(token, config.redis.expire);
    },
    getUsernamePerToken: function(token) {
        return new Promise(function(resolve, reject) {
            client.get(token, function(err, response) {
                if(err) reject(err);
        
                resolve(response);
            })
        })
    }
};
