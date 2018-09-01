module.exports = {

    'secret': 'ilovescotchyscotch',
    'tokenValidityInSeconds': 60,
    'database': 'mongodb://localhost/User',
    'saltLength': 40,
    
    'validations': {
        'usernameRegEx': /^[0-9a-zA-Z_]+$/,
        'passwordMinLength': 6,
        'emailRegEx': /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    },
    
    'port': 3000,
    'redis': {
        'expire': 1440
    }
};
