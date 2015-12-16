/*
 * Protocol for Socket responses. Please see /module/packet.js for more info
 */
var Packet = {
	CHAT_MESSAGE :  1,	
	USER_AUTH_NEW: 2,
	USER_AUTH_RESPONSE: 3,
	USER_JOIN: 4,
	ADMIN_AUTH_NEW: 5,
	ADMIN_AUTH_RESPONSE: 6,
	USER_CHECK_GAME: 7,
	USER_CHECK_RESPONSE: 8,
	ADMIN_VALID_TILE: 9,
};
var user;
var socket = io.connect('http://localhost:1234'); // change to IP of server in production

/*
 * @param data 	see /modules/packet.js for full protocol       
 * 		if error
 *         data { err: 'description of error', errCode: # }
 *      else 
 *         data { user: newUserObject }
 * Takes an authorization response from server and shows an error if resonse contains one
 * Otherwise sets game logic, calls gameboard setup function and removes the login el
 */ 
socket.on(Packet.USER_AUTH_RESPONSE, function (data) {
	if(data.err) {
		displayError(data.err);
		$('.login').find('h3').css({ 'text-align': 'center' });
		return;		
	}
	user = data.user;
	playerSetup();
	// append that current user joined the chat 
	$userName = $('<span>', { class: 'message-username', text: data.user.name }).css({'color': data.user.color});
	$join = $('<p>', { class: 'message-content', text: ' joined the chat' }).prepend($userName);
	$li = $('<li>', {class: 'message'}).append($join);
	$('#messages').append($li);
	$('.login').fadeOut('fast');
});

/*
 * @param data { user: userObject } see /modules/packet.js for full protocol       
 * Appends a message to the chat every time a new user is added to the session
 * Considering removing this so that it doesn't bother people
 */ 
socket.on(Packet.USER_JOIN, function (data) {
	console.log('on USER_JOIN');
	$userName = $('<span>', { class: 'message-username', text: data.user.name }).css({'color': data.user.color});
	$join = $('<p>', { class: 'message-content', text: ' has joined the chat' }).prepend($userName);
	$li = $('<li>', {class: 'message'}).append($join);
	$('#messages').append($li);
});

/*
 * @param data 	see /modules/packet.js for full protocol       
 * 		if error
 *         data { err: 'description of error', errCode: # }
 *      else 
 *         data { success: boolean }
 * Handles an admin authorization response after requesting login
 * Sets up the admin display panel for the game with chat
 */ 
socket.on(Packet.ADMIN_AUTH_RESPONSE, function (data) {
	console.log('on ADMIN_AUTH_RESPONSE');
	console.log(data);
	if(data.err) {
		displayError(data.err);
		return;
	} else if ( data.success ) {
		adminSetup();
		$userName = $('<span>', { class: 'message-username', text: data.user.name }).css({'color': data.user.color});
		$join = $('<p>', { class: 'message-content', text: ' joined the chat' }).prepend($userName);
		$li = $('<li>', {class: 'message'}).append($join);
		$('#messages').append($li);
		$('.login').fadeOut('fast');
	}
});

/*
 * @param data { user: userObject, msg: messageText } see /modules/packet.js for full protocol       
 * Appends a message to the chat room given a chat message from the server
 * Autoscrolls the page to the bottom to display newest messages
 */ 
socket.on(Packet.CHAT_MESSAGE, function (data) {
	$userName = $('<span>', { class: 'message-username', text: data.user.name }).css({'color': data.user.color});
	$message = $('<p>', { class: 'message-content', text: ': ' + data.msg }).prepend($userName);
	$li = $('<li>', {class: 'message'}).append($message);
	$('#messages').append($li);
	window.scrollTo(0, document.body.scrollHeight); // always scrolls to the bototm to show new messages
});

socket.on(Packet.USER_CHECK_RESPONSE, function (data) {
	if(data.err) {
		console.log(data.tiles);
	} else {
		alert('You are a winner!');
	}
});