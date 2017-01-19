var path = require('path');

module.exports = {
    home: function(req, res) {
        res.send('Hello! The API is at http://localhost:3000/api');
    },
    login: function(req, res) {
        res.sendFile(path.join(__dirname, '/public/login.html'));
    },
    register: function(req, res) {
        res.sendFile(path.join(__dirname + '/public/register.html'));
    },
    chat: function(req, res) {
        res.sendFile(path.join(__dirname, '/public/chat.html'));
    }
}
