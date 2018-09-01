var config = require('../../app/config');

module.exports.checkUserName = function (username) {
	if(!username) return false;
	var regEx = config.validations.usernameRegEx;

	if(!username.match(regEx)) {
		return false;
		
	}
	
	return true;
}

module.exports.checkPassword = function(password) {
	if(!password || password.length < config.validations.passwordMinLength) 
		return false;
		
	return true;
}

module.exports.checkEmail = function(email) {
	var regEx = config.validations.emailRegEx;

	if(!email || email.match(regEx)) return false;

	return true;
}
