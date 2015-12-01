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
	app = express(),
	port = 1234;

// Bcrypt hashing of admin password found at route /admin
var bcrypt = require('bcryptjs'),
	SALT_FACTOR = 10,
	secret = '$2a$10$9bmBtYeEG0FLED/g7ujBUeLhgRYvu70iWlBlCyXBE3EALsYN.3ASi';

/*
 * If you want to set a new password, uncomment code and run server.js
 * Change var secret to the hash, and recomment the code
 * 
bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
	if (err) return(err);
    bcrypt.hash(secret, salt, function(err, hash) {
    	if (err) return next(err);
    	secret = hash;
    	console.log('Hashed Password: ' + hash);
    });
});
*/

process.env.NODE_ENV = process.env.NODE_ENV || 'local';

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

// Route for /public/admin.html
app.get('/admin', function(req, res) {
	var options = {
		dotfiles: 'allow'
	}
	res.sendFile(__dirname + '/public/admin.html', options);	
});

var server = http.createServer(app);
server.listen((process.env.PORT || port), function() {
	debug_http('Started connect web server running on localhost:' + (process.env.PORT || port));
});
var sio = io.listen(server);
var validTiles = [];

// Configures authorization scheme during initial handshake to save session data
sio.set('authorization', function (handshakeData, accept) {
	// this doesn't even trigger until socket.io interacts with a socket.io client
	if(handshakeData.headers.cookie) {
		handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
		handshakeData.sessionID = cookieParser.signedCookie(handshakeData.cookie['express.sid'], 'thisistheinfoclassoftheyear'); 
		if(handshakeData.cookie['express.sid'] == handshakeData.sessionID) {
			debug('Cookie is invalid');
			return accept('Cookie is invalid', false);
		} 
	} else {
		return accept('No cookie transmitted', false);
	}
	accept(null, true);
});

sio.sockets.on('connection', function (socket){

	debug('Connection made. SessionID: ' + socket.request.sessionID);

	/*
	 * @param data: { userName: '', color: '' } see /modules/packet.js for full protocol
	 * @emits data: { err: 'description of error', errCode: # } if error
	 * @emits data: { user: newUserObject } if successful
	 * Takes an authorization request from a user and allows them to join the room
	 */ 
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
        	socket.emit(Packet.USER_AUTH_RESPONSE, { 
        		user: newUser, 
        		session: socket.request.session 
        	});
        	socket.broadcast.emit(Packet.USER_JOIN, { 
        		user: newUser 
        	});
        }
	});

	/*
	 * @param data { password: '' } see /modules/packet.js for full protocol
	 * @emits data: { err: 'description of error', errCode: # } if error
	 * @emits data: { success: boolean } if successful
	 * Takes an authorization request an admin with the supplied password
	 */ 
	socket.on(Packet.ADMIN_AUTH_NEW, function (data) {
		debug('Received ADMIN_AUTH_NEW Packet from: ' + socket.request.sessionID);
		bcrypt.compare(data.password, secret, function(err, res) {
			if(err) return err;
			if(res == false) {
				socket.emit(Packet.ADMIN_AUTH_RESPONSE, { 
					err: 'Incorrect Password', 
					errCode: 1 
				});
			} else {
				var newUser = new User(data.userName, data.color, socket.id);
				users.addUser(newUser);
				socket.emit(Packet.ADMIN_AUTH_RESPONSE, { 
					success: true,
					user: newUser
				});
	        	socket.broadcast.emit(Packet.USER_JOIN, { 
	        		user: newUser 
	        	});
			}
		});
	});

	/*
	 * @param data: { user: userObject, msg: messageText, time: timeStamp } see /modules/packet.js for full protocol
	 * @emits data: { user: userObject, msg: messageText, time: timeStamp }
	 * Represents a chat message and emits the message to all in the room (including the admin)
	 */
	socket.on(Packet.CHAT_MESSAGE, function (data) {
		//debug('Received CHAT_MESSAGE Packet'); // this will go crazy in production
		var registeredUser = users.getUserBySocketID(socket.id);
		if (registeredUser && registeredUser === data.user.name) {
			socket.emit(Packet.CHAT_MESSAGE, data);
			socket.broadcast.emit(Packet.CHAT_MESSAGE, data);
		}
	});

	/*
	 * @param data: { tiles: [int] } see /modules/packet.js for full protocol
	 * @emits data: { err: 'description of error', tiles: [incorrectlySelectedTiles] } if error
	 * @emits data: { isWinner: boolean } if successful
	 * Checks the passed tiles against valid tiles. Emits if the player is a winner or not
	 */
	socket.on(Packet.USER_CHECK_GAME, function (data) {
		var wrongTiles = [];
		for(var i = 0; i < data.tiles.length; i++) {
			if(validTiles.indexOf(data.tiles[i]) === -1) { // if the tile isn't a valid tile
				wrongTiles.push(data.tiles[i]);
			}
		}
		if(wrongTiles.length > 0) { // user has some incorrect tiles
			socket.emit(Packet.USER_CHECK_RESPONSE, {
				err: '',
				tiles: wrongTiles
			});
		} else { // user has no wrong tiles, is a winner
			socket.emit(Packet.USER_CHECK_RESPONSE, {
				isWinner: true
			});			
		}
	});

	/*
	 * @param data: { addTile: boolean, tileIndex: intTileIndex} see /modules/packet.js for full protocol
	 * Represents the admin adding/removing valid tiles for the game
	 */
	socket.on(Packet.ADMIN_SELECT_TILE, function (data) {
		if(data.addTile) { // if adding tiles, push the valid tile to the top
			validTiles.push(data.tileIndex);
		} else { // otherwise remove the tile from the list of valid tiles
			validTiles.splice(validTiles.indexOf(data.tileIndex), 1); 
		}
	});

	// handle graceful disconnection 
	socket.on('disconnect', function (data) {
		//console.log('Received disconnect from: ' + socket.request.sessionID);
	});

});