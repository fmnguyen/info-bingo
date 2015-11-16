var http = require('http'),
	express = require('express'),
	io = require('socket.io'),
	cookie = require('cookie');

// logging variables
var	debug = require('debug')('socket.io'),
	debug_http = require('debug')('http');


// own modules
var Packet = require('./modules/packet'), // protocol for socket connections
	User = require('./modules/user'), // User object, see ./module/user.js for more information
	userStore = require('./modules/userStore'), // stores all the users and their sockets
	users = new userStore();


// Dependencies after Express migrated to 4.x.x, more information @ https://github.com/senchalabs/connect#middleware
var cookieParser = require('cookie-parser'),
	session = require('express-session'),
	app = express();

var port = 1234;

// Configures our express app to save cookies and sessions
app.use(cookieParser());
app.use(session({
	secret: 'thisistheinfoclassoftheyear', 
	key: 'express.sid',
	resave: false,
	saveUninitialized: true
}));

// Mounts our app to send GET requests for everything in public directory
app.use(express.static(__dirname + '/public'));

// Redirects all '/' routes directly to /public/index.html
app.get('/', function(req, res){
	var options = {
		dotfiles: 'allow'
	}
	res.sendFile(__dirname + '/index.html', options);
});

var server = http.createServer(app);
server.listen((process.env.PORT || port), function() {
	debug_http('Started connect web server running on localhost:' + (process.env.PORT || port));
});
var sio = io.listen(server);

// Configures authorization scheme during initial handshake to save session data
sio.set('authorization', function (handshakeData, accept) {
	// this doesn't even trigger until socket.io interacts with a socket.io client
	if(handshakeData.headers.cookie) {
		handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
		handshakeData.sessionID = cookieParser.signedCookie(handshakeData.cookie['express.sid'], 'thisistheinfoclassoftheyear'); 
		if(handshakeData.cookie['express.sid'] == handshakeData.sessionID) {
			return accept('Cookie is invalid', false);
		} 
	} else {
		return accept('No cookie transmitted', false);
	}
	accept(null, true);
});

sio.sockets.on('connection', function (socket){

	debug('Connection made. SessionID: ' + socket.request.sessionID);

	// when someone sends a chat message, emit the data to all users (except for sending client) and update
	socket.on(Packet.CHAT_MESSAGE, function (data) {
		debug('Received CHAT_MESSAGE Packet');
		var registeredUser = users.getUserBySocketID(socket.id);
		if (registeredUser && registeredUser === data.user.name) {
			socket.emit(Packet.CHAT_MESSAGE, data);
			socket.broadcast.emit(Packet.CHAT_MESSAGE, data);
		}
	});

	// whenever a new user is added, add them to list of users and then authorize using cookie handshake
	socket.on(Packet.USER_AUTH_NEW, function (data) {
		debug('Received USER_AUTH_NEW Packet from: ' + socket.request.sessionID);
        if(users.hasUser(data.userName)) {
        	console.log('Username already taken');
        	socket.emit(Packet.USER_AUTH_RESPONSE, { err: 'Username already taken', errCode: 2 })
        } else if (data.userName.length > 16){
        	console.log('Username too long');
        	socket.emit(Packet.USER_AUTH_RESPONSE, { err: 'Username too long', errCode: 1 })
        } else {
        	var newUser = new User(data.userName, data.color, socket.id);
        	users.addUser(newUser);

        	socket.emit(Packet.USER_AUTH_RESPONSE, { user: newUser });
        	socket.broadcast.emit(Packet.USER_JOIN, { user: newUser });
        }
	});

	// whenever someone requests that their tiles are correct, send the check to the master
	// authorization scheme
	socket.on('master_check', function (data) {

	});

	// update all players based on which tiles have been called or completed
	// 
	socket.on('update_players', function (data) {

	});

	// handle graceful disconnection 
	socket.on('disconnect', function (data) {
		//console.log('Received disconnect from: ' + socket.request.sessionID);
	});

});