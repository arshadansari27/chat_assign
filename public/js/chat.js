

var app = angular.module("testapp",[
   'ngStorage'
]);

app.factory("DataModel", function() {
  var Service = {};
  
  
  
  return Service;
});

app.config(function($locationProvider){
    $locationProvider.html5Mode({enabled: true, requireBase: false}).hashPrefix('!');
});

app.controller("ChatController", function($scope, $location, $localStorage) {
    $scope.users = [];
    var token = localStorage.getItem('access_token');
    var username = localStorage.getItem('user');
  var iosocket = io.connect('http://localhost:3001'); 
      iosocket.on('connect', function () { 
      $('#incomingChatMessages').append($('<p>Connected</p>')); 
    iosocket.send({connection: username});
    iosocket.on('message', function(message) { 
        if(message.connection) {
            console.log(message.connection);
            if ($scope.users.indexOf(message.connection) == -1) {
                $scope.users.push(message.connection);
                $scope.$apply();
            }
            return;
        }
        console.log(message);
        //$('#incomingChatMessages').append($('<li></li>').text(message)); 
    }); 
    iosocket.on('disconnect', function() { 
    $('#incomingChatMessages').append('<p>Disconnected</p>'); 
  }); 
  });


  $scope.chatMessagesAllUser = {};
  $scope.chatToUser = function(user) {
        console.log('[*] Chatting with ', user);
        if (!$scope.chatMessagesAllUser[user.username]) {
            $scope.chatMessagesAllUser[user.username] = [];
        }
        $scope.chatMessages = $scope.chatMessagesAllUser[user.username];
        $scope.selectedUser = user.username;
  }

  $scope.chatMessages = [];
  $scope.selectedUser = null;
  
  $scope.formatChat = function(icon,username,text,origDt) {
    var chat = {};
    chat.icon = icon;
    chat.username = username;
    chat.text = text;
    chat.origDt = origDt;
    return chat;
  }
  
  $scope.addChat = function(username) {
    if ($scope.newChatMsg != "") {
      var chat = $scope.formatChat("http://placehold.it/16x16",
                           username,
                           $scope.newChatMsg,
                           new Date());
       
      $scope.chatMessages.push(chat);
      io.send({user: username, message: $scope.newChatMsg});
      $scope.newChatMsg = "";
    }
    else {
      
    }
  }
  
});

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});