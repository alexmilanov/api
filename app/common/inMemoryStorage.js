var redis = require('redis');
var client = redis.createClient();

client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    throw Error('Something went wrong ' + err);
});

var config = require('../config');

module.exports = {
    setUsernameAndToken: function(token, username) {
        client.hset(token, 'username', username);
        //client.expireat(token, config.redis.expire);
    },
    getUsernamePerToken: function(token) {
        return new Promise(function(resolve, reject) {
            client.hget(token, 'username', function(err, response) {
                if(err) reject(err);

                resolve(response);
            })
        })
    },

    setTokenIssueTimestamp: function(token, timestamp) {
        client.hset(token, 'issuedAt', timestamp)
    },
    getTokenIssuedTimestamp: function(token) {
        return new Promise(function(resolve, reject) {
            client.hget(token, 'issuedAt', (err, response) => {

                if(err) reject(err);

                resolve(response);
            })
        })
    },

};
