var mongoose = require('mongoose');
var schema = mongoose.Schema;

var user = new schema({
		username: String,
		password: String,
		isAdmin: Boolean,
		salt: String,
		email: String,
		userAccountData: {
			createdAt: Date,
			isActive: Boolean,
			lastLogin: Date
		}
});

user.index({username: 1}, {unique: true});

module.exports = mongoose.model('User', user);
