var socketio = require('socket.io');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');

var jwt = require('jsonwebtoken');
var config = require('./config');
var mongoose = require('mongoose');

mongoose.connect(config.database, function(err) {
    if (err) throw err;
});
var User = require('./models/user');
var Message = require('./models/message');

var port = process.env.PORT || 3000;
var websocket_port = 3001
var app = express();
app.set('superSecret', config.secret);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/public/js', express.static(__dirname + '/public/js'));
//var apiRoutes = express.Router(); 
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});
//app.use('/',  express.static(__dirname + ''));
app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/login.html'));
});

app.get('/signup', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/register.html'));
});

app.post('/api/users', function(req, res) {
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;
    var confirm = req.body.confirm;
    if (!name || !username || !password || !confirm) {
        res.status(400)
        res.json({ success: false, message: 'Invalid Parameter.' });
    }
    if (password != confirm) {
        res.status(400)
        res.json({ success: false, message: 'Passwords do no match.' });
    }
    User.createOrUpdate({
        name: name,
        username: username,
        password: password
    }).then(function(user) {
        res.status(201)
        res.json(user);
    }).catch(function(err) {
        res.status(500)
        res.json({ success: false, message: err.message });
    });
});

app.post('/api/authenticate', function(req, res) {
    User.getByUsername(req.body.username).then(function(user) {
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User was not found.' });
        } else if (user) {
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Invalid credentials.' });
            } else {
                var token = jwt.sign(user, app.get('superSecret'), {});
                console.log("[*] Auth:", user.username)
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token,
                    username: user.username
                });
            }

        }

    }).catch(function(error) {
        res.json({ success: false, message: 'Authentication failed. ' + error.message });
    });
});


var apiRoutes = express.Router();

apiRoutes.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

apiRoutes.get('/chat', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/chat.html'));
});


apiRoutes.get('/api/messages', function(req, res) {
    var to = req.query.to;
    var from = req.query.from;
    var query = {};
    if (to && from) {
        query = {
            to: {
                $in: [from, to]
            },
            from: {
                $in: [from, to]
            }
        };
    } else {

        if (to) {
            query.to = to;
        }
        if (from) {
            query.from = from;
        }
    }
    Message.getByQuery(query).then(function(messages) {
        res.json(messages);
    }).catch(function(err) {
        res.status(500)
        res.json({ success: false, message: err.message });
    });
});

app.use('/', apiRoutes);

var sockets = {};


socketio.listen(websocket_port).on('connection', function(socket) {
    console.log('Connection established');
    setInterval(function() {
        socket.send({ 'connection': Object.keys(sockets) });
    }, 10000)
    socket.on('message', function(msg) {
        if (msg && msg.connection) {
            console.log('broadcasting');
            sockets[msg.connection] = socket;
            socket.broadcast.emit({ 'connection': Object.keys(sockets) });
            socket.send({ 'connection': Object.keys(sockets) });
            return;
        }
        if (msg.message && msg.to && msg.from) {
            var token = msg.token;
            if (token) {
                jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                    if (err) {
                        return;
                    } else {
                        console.log('Sending message', msg);
                        Message.postMessage(msg.from, msg.to, msg.message)
                            .then(function(message) {
                                if (sockets[msg.to]) {
                                    sockets[msg.to].send(msg);
                                }

                            }).catch(function(error) {
                                console.log(error);
                            });
                    }
                });
            }

        }
        console.log('Message Received: ', msg);
    });
});

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});
