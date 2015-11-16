var Packet = {
	CHAT_MESSAGE :  1,	
	USER_AUTH_NEW: 2,
	USER_AUTH_RESPONSE: 3,
	USER_JOIN: 4
};
var user;
var socket = io.connect('http://localhost:1234');

socket.on(Packet.USER_AUTH_RESPONSE, function (data) {

	if(data.err) {
		// append username already taken error response
		return;		
	}

	user = data.user;

	// load chat, show that you've entered, etc
	// change to a setUp() function

	$userName = $('<span>', { class: 'message-username', text: data.user.name }).css({'color': data.user.color});
	$join = $('<p>', { class: 'message-content', text: ' has joined the chat' }).prepend($userName);
	$li = $('<li>', {class: 'message'}).append($join);
	$('#messages').append($li);

	$('.login').fadeOut('fast');
	$('.chat-container').fadeIn('fast');
	$('.game-content').fadeIn('fast');
});

// broadcasts that a user has joined to all other people in room
socket.on(Packet.USER_JOIN, function (data) {
	console.log('on USER_JOIN');
	$userName = $('<span>', { class: 'message-username', text: data.user.name }).css({'color': data.user.color});
	$join = $('<p>', { class: 'message-content', text: ' has joined the chat' }).prepend($userName);
	$li = $('<li>', {class: 'message'}).append($join);
	$('#messages').append($li);
});

// renders a chat message to everyone in chat room
socket.on(Packet.CHAT_MESSAGE, function (data) {
	$userName = $('<span>', { class: 'message-username', text: data.user.name }).css({'color': data.user.color});
	$message = $('<p>', { class: 'message-content', text: ': ' + data.msg }).prepend($userName);
	$li = $('<li>', {class: 'message'}).append($message);
	$('#messages').append($li);
});