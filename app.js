var socketio = require('socket.io');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var config = require('./config');
var mongoose = require('mongoose');

var userApi = require('./api').userApi;
var messageApi = require('./api').messageApi;
var tokenApi = require('./api').tokenApi;
var middleware = require('./middleware');
var ioService = require('./services').ioService;
var views = require('./views');

mongoose.connect(config.database, function(err) {
    if (err) throw err;
});


var port = process.env.PORT || 3000;
var websocket_port = 3001

var app = express();

app.set('superSecret', config.secret);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/public/js', express.static(__dirname + '/public/js'));
app.get('/', views.home);
//app.use('/',  express.static(__dirname + ''));
app.get('/login', views.login);
app.get('/signup', views.register);

app.post('/api/users', userApi.create);
app.post('/api/authenticate', tokenApi.authenticate);


var apiRoutes = express.Router();
apiRoutes.use(middleware.authInterceptor);
apiRoutes.get('/chat', views.chat);
apiRoutes.get('/api/messages', messageApi.fetchAll);
app.use('/', apiRoutes);

var sockets = {};


socketio.listen(websocket_port).on('connection', ioService.onConnect);

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});
