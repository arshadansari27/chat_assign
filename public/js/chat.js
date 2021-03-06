var app = angular.module("testapp", [
    'ngStorage'
]);

app.factory("DataModel", function() {
    var Service = {};



    return Service;
});

app.config(function($locationProvider) {
    $locationProvider.html5Mode({ enabled: true, requireBase: false }).hashPrefix('!');
});

app.controller("ChatController", function($scope, $http, $location, $localStorage) {
    $scope.users = [];
    $scope.chatMessagesAllUser = {};
    var token = localStorage.getItem('access_token');
    var username = localStorage.getItem('user');


    var iosocket = io.connect('http://localhost:3001');
    iosocket.on('connect', function() {
        $('#incomingChatMessages').append($('<p>Connected</p>'));
        iosocket.send({ connection: username });
        iosocket.on('message', function(message) {
            if (message.from && message.to && message.message) {
                var chat = $scope.formatChat("http://placehold.it/16x16", message.from, message.message, new Date(message.created_at));
                $scope.chatMessagesAllUser[message.from].push({ message: message.message, sent: message.created_at });
                $scope.chatMessages.push(chat);
                $scope.$apply();
                return;
            }
            if (message.connection) {
                console.log(message.connection);
                $scope.users = message.connection.filter(function(item) {
                    return item != username;
                });
                $scope.$apply();
                return;
            }
            //$('#incomingChatMessages').append($('<li></li>').text(message)); 
        });
        iosocket.on('disconnect', function() {
            $('#incomingChatMessages').append('<p>Disconnected</p>');
        });
    });



    $scope.chatToUser = function(user) {
        console.log('[*] Chatting with ', user);
        $scope.chatMessagesAllUser[user] = [];
        $http.get("/api/messages?to=" + username + '&from=' + user + '&token=' + token)
            .then(function(messages) {
                if (!messages || !messages.data || messages.data.length === 0) return;
                messages.data.forEach(function(message) {

                    var chat = $scope.formatChat("http://placehold.it/16x16",
                        message.from,
                        message.message,
                        new Date(message.created_at));

                    $scope.chatMessagesAllUser[user].push(chat);
                });
                $scope.chatMessages = $scope.chatMessagesAllUser[user];
                $scope.selectedUser = user;
            }).catch(function(error) {
                console.log(error);
            });
    }

    $scope.chatMessages = [];
    $scope.selectedUser = null;

    $scope.formatChat = function(icon, username, text, origDt) {
        var chat = {};
        chat.icon = icon;
        chat.username = username;
        chat.text = text;
        chat.origDt = origDt;
        return chat;
    }

    $scope.addChat = function(_username) {
        if ($scope.newChatMsg != "") {
            var chat = $scope.formatChat("http://placehold.it/16x16",
                username,
                $scope.newChatMsg,
                new Date());

            $scope.chatMessages.push(chat);
            iosocket.send({ from: username, to: _username, message: $scope.newChatMsg, token: token });
            $scope.newChatMsg = "";
        }
    }

});

app.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});
