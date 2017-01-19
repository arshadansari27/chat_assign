var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var messageSchema = new Schema({
    message: String,
    from: String,
    to: String,
    created_at: Date,
    updated_at: Date
});


messageSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

var Message = mongoose.model('Message', messageSchema);
// make this available to our users in our Node applications
module.exports = {


    getByQuery: function(query) {
        return new Promise(function(resolve, reject) {
            Message.find(query, function(err, messages) {
                if (err) reject(err);
                resolve(messages);
            });
        });
    },

    getByFromUser: function(username) {
        return new Promise(function(resolve, reject) {
            Message.find({ from: username }, function(err, messages) {
                if (err) reject(err);
                resolve(messages);
            });
        });
    },


    getByToUser: function(username) {
        return new Promise(function(resolve, reject) {
            Message.find({ to: username }, function(err, messages) {
                if (err) reject(err);
                resolve(messages);
            });
        });
    },

    getMessagesBetween: function(user1, user2) {
        return new Promise(function(resolve, reject) {
            Message.find({
                to: {
                    $in: [user1, user2]
                },
                from: {
                    $in: [user1, user2]
                }
            }, function(err, messages) {
                if (err) reject(err);
                resolve(messages);
            });
        });
    },


    getAll: function(username) {
        return new Promise(function(resolve, reject) {
            Message.find({}, function(err, messages) {
                if (err) reject(err);
                resolve(messages);
            });
        });
    },

    postMessage: function(from, to, message) {
        var newMessage = Message({
            message: message,
            from: from,
            to: to
        });
        return new Promise(function(resolve, reject) {
            newMessage.save(function(err) {
                if (err) reject(err);
                console.log('Message created!', newMessage);
                resolve(newMessage);
            });
        });
    }
};
