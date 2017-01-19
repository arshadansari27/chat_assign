var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models').user;

module.exports = {

    authenticate: function(req, res) {
        User.getByUsername(req.body.username).then(function(user) {
            if (!user) {
                res.status(401);
                res.json({ success: false, message: 'Authentication failed. User was not found.' });
            } else if (user) {
                if (user.password != req.body.password) {
                    res.status(401);
                    res.json({ success: false, message: 'Authentication failed. Invalid credentials.' });
                } else {
                    console.log("Creating token", config.secret);
                    var token = jwt.sign(user, config.secret, {});
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token,
                        username: user.username
                    });
                }
            }
        }).catch(function(error) {
            res.status(401);
            res.json({ success: false, message: 'Authentication failed. ' + error.message });
        });
    }

}
