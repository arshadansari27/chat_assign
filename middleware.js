var jwt = require('jsonwebtoken');
var jwtService = require('./services').jwtService;

module.exports = {
    authInterceptor: function(req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            jwtService.verify(token).then(function(user) {
                req.decoded = user;
                next();
            }).catch(function(error) {
                res.status(401);
                return res.json({ success: false, message: 'Failed to authenticate token.', error: error });
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    }
}
