var User = require('../models').user;

module.exports = {

        create: function(req, res) {
            var name = req.body.name;
            var username = req.body.username;
            var password = req.body.password;
            var confirm = req.body.confirm;
            if (!name || !username || !password || !confirm) {
                res.status(400)
                res.json({ success: false, message: 'Invalid Parameter.' });
            }
            if (password != confirm) {
                res.status(400)
                res.json({ success: false, message: 'Passwords do no match.' });
            }
            User.createOrUpdate({
                name: name,
                username: username,
                password: password
            }).then(function(user) {
                res.status(201)
                res.json(user);
            }).catch(function(err) {
                res.status(500)
                res.json({ success: false, message: err.message });
            });
        },

}
