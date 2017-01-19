var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var messageSchema = new Schema({
  name: String,
  user: String,
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

    getByUser: function(user) {
        return new Promise(function(resolve, reject) {
            Message.find({user: user.id}, function(err, messages) {
                if (err) reject(err);
                resolve(messages);
            });
        });
    },

    postMessage: function(user, message) {
        var newMessage = Message({
            message: message
            user: user
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
