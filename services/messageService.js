var jwtService = require('./jwtService');
var Message = require('../models').message;

var Sockets = {};

module.exports = {
    updateUsers: function(socket) {
        return function() {
            socket.send({ 'connection': Object.keys(Sockets) });
        }
    },
    handleMessage: function(socket, msg) {
        if (msg && msg.connection) {
            console.log('broadcasting');
            Sockets[msg.connection] = socket;
            socket.broadcast.emit({ 'connection': Object.keys(Sockets) });
            socket.send({ 'connection': Object.keys(Sockets) });
            return;
        }
        if (msg.message && msg.to && msg.from) {
            var token = msg.token;
            if (token) {
                jwtService.verify(token).then(function(user) {
                    return Message.postMessage(msg.from, msg.to, msg.message);
                }).then(function(message) {
                    if (Sockets[msg.to]) {
                        Sockets[msg.to].send(msg);
                    }
                }).catch(function(error) {
                    throw error;
                })
            } else {
                console.log("message not forwarding since there is no token", msg);
            }

        }
    }
}
