var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String},
  created_at: Date,
  updated_at: Date
});


userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

var User = mongoose.model('User', userSchema);
// make this available to our users in our Node applications
module.exports = {

    getById: function(id) {
        return new Promise(function(resolve, reject) {
            User.findById(id, function(err, user) {
                if (err) reject(err);
                console.log(user);
                resolve(user);
            });
        });
    },

    getByUsername: function(username) {
        return new Promise(function(resolve, reject) {
            User.find({username: username}, function(err, users) {
                if (err) reject(err);
                console.log(users);
                if (users.length > 0) resolve(users[0]);
                reject(users);
            });
        });
    },

    createOrUpdate: function(options) {
        var newUser = User({
            name: options.name,
            username: options.username,
            password: options.password,
        });
        return new Promise(function(resolve, reject) {
            newUser.save(function(err) {
                if (err) reject(err);
                console.log('User created!', newUser);
                resolve(newUser);
            });
        });
    },

    getAll: function(options) {
        var query = {};
        if (options && options.name) {
            query.name = options.name
        }
        return new Promise(function(resolve, reject) {
            User.find(query, function(err, users) {
                if (err) reject(err);
                console.log(users);
                resolve(users);
            });
        });
    },

    destroy: function(id) {
        return new Promise(function(resolve, reject) {
            User.findById(id, function(err, user) {
                if (err) reject(err);
                user.remove(function(err) {
                    if (err) reject(err);
                    console.log('User successfully deleted!');
                    resolve(true);
                });
            });
        });
    }

};
