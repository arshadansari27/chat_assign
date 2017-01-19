var messageService = require('./messageService');

module.exports = {
    onConnect: function(socket) {
        console.log('Connection established');
        setInterval(messageService.updateUsers(socket), 10000);
        socket.on('message', function(msg) {
            messageService.handleMessage(socket, msg);
            console.log('Message Received: ', msg);
        });
    }
}
