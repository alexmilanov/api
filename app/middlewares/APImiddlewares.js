/* 
This file contain middlewares related with user registration, authentication, token validation, etc.
*/

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../../app/config'); // get our config file
var User   = require('../../app/models/user'); // get our mongoose model

var userPassValidation = require('../../app/common/validation.js');
var generateSalt = require('../../app/common/security/generateSalt.js');
var hashPassword = require('../../app/common/security/hashPassword.js');

var inMemoryStorage = require('../../app/common/inMemoryStorage');
var token = null;

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
						const payload = {
								admin: user.admin
						}
						
						token = jwt.sign(payload, req.app.get('secret'), {
								expiresIn: config.tokenValidityInSeconds
						});

						inMemoryStorage.setUsernameAndToken(token, req.body.username);

						user.userAccountData.lastLogin = Date();

						user.save((err) => {
							if(err) res.json({
								success: false,
								message: 'Cannot update last login'
							})
						})
			
						res.json({
							success: true,
							message: 'Done',
							token: token
					});
					}
			})
		},
		checkToken: function(req, res, next) {
			var token = req.body.token || req.query.token || req.headers['x-access-token'];
	
			if(!token) {
				return res.status(403).send({
					success: false,
					message: 'No token provided'
				});
			}
			
			jwt.verify(token, req.app.get('secret'), (err, decoded) => {
				if(err) return res.json({
							success: false,
							message: 'Cannot verify the token'
						});
						
				req.decoded = decoded;
				
				 next();
			});
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
					error: 'Password should contain at least ' + config.passwordMinLength + ' symbols'
				});
			}
			
			var salt = generateSalt.getSalt(config.saltLength)
			var hashedPassword = hashPassword.hashPassword(req.body.password, salt);

			var exists = false;
			
			User.findOne({username: req.body.username}, (err, users)=> {
					if(err) throw err;
		
					if(users) {	
						return res.json({
							success: false,
							error: 'User already exists'
							
						});
					}
					else {
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
					}
			});
		}
}
