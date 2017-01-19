var Message = require('../models').message;

module.exports = {
    fetchAll: function(req, res) {
        var to = req.query.to;
        var from = req.query.from;
        var query = {};
        if (to && from) {
            query = {
                to: {
                    $in: [from, to]
                },
                from: {
                    $in: [from, to]
                }
            };
        } else {
            if (to) {
                query.to = to;
            }
            if (from) {
                query.from = from;
            }
        }
        Message.getByQuery(query).then(function(messages) {
            res.json(messages);
        }).catch(function(err) {
            res.status(500)
            res.json({ success: false, message: err.message });
        });
    }
}
