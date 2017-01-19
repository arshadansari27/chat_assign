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

app.controller("ChatController", function($scope, $location, $localStorage) {
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
                console.log(message);
                console.log("TO ME", username, message.to);
                var chat = $scope.formatChat("http://placehold.it/16x16", message.from, message.message, new Date());
                $scope.chatMessagesAllUser[message.from].push(message.message);
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
        if (!$scope.chatMessagesAllUser[user]) {
            $scope.chatMessagesAllUser[user] = [];
        }
        $scope.chatMessages = $scope.chatMessagesAllUser[user];
        $scope.selectedUser = user;
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
            iosocket.send({ from: username, to: _username, message: $scope.newChatMsg });
            $scope.newChatMsg = "";
        } else {

        }
    }

});

app.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});
