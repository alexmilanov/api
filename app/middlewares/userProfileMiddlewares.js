/* 
This file contain middlewares related with the user profile data - update password, get settings and etc.
*/
var User = require('../../app/models/user');

module.exports = {
    getAccountData: function(req, res) {
        if(!req.query.username) {
                return res.json({
                success: false,
                error: "Username is mandatory"
            })
        }

        User.findOne({username: req.query.username}, (err, users)=> {
            if(err) throw err;

            if(users) {	
                return res.json({
                    success: true,
                    lastLogin: users.userAccountData.lastLogin,
                    accountCreatedAt: users.userAccountData.createdAt,
                    username: users.username,
                    email: users.email
                });
            }

            return res.json({
                success: false,
                error: "No such user"
            });
        })
    },

    updateEmail: function(req, res) {
        if(!req.query.password) {
            res.json({
                success: false,
                error: "Email and/or Username is mandatory"
            })
        }

        User.findOneAndUpdate()
    },

    updatePassword: function(req, res) {

    },
}
