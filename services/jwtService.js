var config = require('../config');
var jwt = require('jsonwebtoken');

module.exports = {
    verify: function(token) {
        return new Promise(function(resolve, reject) {
            console.log("Verifying token", config.secret);
            try {
                jwt.verify(token, config.secret, function(err, decoded) {
                    if (err) {
                        console.log("Verification failed", err)
                        reject(err);
                    } else {
                        console.log("Verified", decoded)
                        resolve(decoded);
                    }
                });
            } catch (err) {
                console.log("Caught:", err);
                reject(err);
            }
        });

    }
}
