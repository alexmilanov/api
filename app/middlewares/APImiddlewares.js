/* 
This file contain middlewares related with user registration, authentication, token validation, etc.
*/

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var randToken = require('rand-token')
var config = require('../../app/config'); // get our config file
var User   = require('../../app/models/user'); // get our mongoose model
var tokenManager = require('../common/tokenManager');

var userPassValidation = require('../../app/common/validation.js');
var generateSalt = require('../../app/common/security/generateSalt.js');
var hashPassword = require('../../app/common/security/hashPassword.js');

var inMemoryStorage = require('../../app/common/inMemoryStorage');

module.exports = {
		authenticate: function(req, res, next) {
			User.findOne({
				username: req.body.username
			}, 
			'', 
			(err, user) => {
					if(err) throw err;
					var genericError = 'Authentication failed, username or password is invalid!';

					if(!user) {
						return res.json({
							success: false,
							error: genericError
						});
					}
					
					var hashedPassword = hashPassword.hashPassword(req.body.password, user.salt);
					if(user.password != hashedPassword) {
						res.json({
							success: false,
							message: genericError
						});
					}
					else {
						user.userAccountData.lastLogin = new Date();

						user.save((err) => {
							if(err) res.json({
								success: false,
								message: 'Cannot update last login'
							})
						})
						let tokenStructure = tokenManager.getTokenStructure({isAdmin: user.isAdmin}, req)
						inMemoryStorage.setUsernameAndToken(tokenStructure.refreshToken, req.body.username);

						res.json(tokenStructure);
					}
			})
		},
		checkToken: function(req, res, next) {
			var token = req.body.token || req.query.token || req.headers['x-access-token'];
			var username = req.body.username || req.query.username || req.headers['username'];
			var refreshToken = req.body.refreshToken || req.query.refreshToken || req.headers['x-refresh-token'];

			if(!token && !refreshToken) {
				return res.status(401).send({
					success: false,
					message: 'No token provided'
				});
			}

			if(token) {
				jwt.verify(token, req.app.get('secret'), (err, decoded) => {

					if(err) return res.status(401).json({
								success: false,
								message: 'Invalid token'
							});

					next();
				});
			}
			else if(refreshToken) {
				if(!username) res.json({
					success: false,
					message: "Username is mandatory when refresh token is provided"
				})

				inMemoryStorage.getUsernamePerToken(refreshToken).then(function(data) {
					if(data == null) res.status(401).send()

					if(username == data) {

						let tokenStructure = tokenManager.getTokenStructure({}, req)
						inMemoryStorage.setUsernameAndToken(refreshToken, username);
						
						res.json(tokenStructure)
					}
				});
			}

		},
		register: function(req, res, next) {
			if(!userPassValidation.checkUserName(req.body.username)) {
				return res.json({
						success: false,
						error: 'Username should contain only alphanumeric symbols and underscore'
				});
			}
			
			if(!userPassValidation.checkPassword(req.body.password)) {
				return res.json({
					success: false,
					error: 'Password should contain at least ' + config.validations.passwordMinLength + ' symbols'
				});
			}
			
			var salt = generateSalt.getSalt(config.saltLength)
			var hashedPassword = hashPassword.hashPassword(req.body.password, salt);
			
			User.findOne({username: req.body.username}, (err, users)=> {
					if(err) throw err;

					if(users) {	
						return res.json({
							success: false,
							error: 'User already exists'
							
						});
					}

					var user = new User({
						username: req.body.username,
						password: hashedPassword,
						isAdmin: false,
						salt: salt,
						email: null,
						userAccountData: {
							createdAt: Date(),
							isActive: true,
							lastLogin: Date()
						}
					});


					user.save((err) => {
						if(err) throw err;			
	
						return res.json({
							success: true,
							error: null
							
						});
					});

			});
		}
}
