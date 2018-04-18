/* 
This file contain middlewares related with the user profile data - update password, get settings and etc.
*/

module.exports = {
    getAccountData: function(req, res, next) {
        res.json({
            success: true
        });
    }
}
