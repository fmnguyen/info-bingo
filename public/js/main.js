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
	playerSetup();

	$userName = $('<span>', { class: 'message-username', text: data.user.name }).css({'color': data.user.color});
	$join = $('<p>', { class: 'message-content', text: ' joined the chat' }).prepend($userName);
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

function playerSetup() {
	// Creates grid of tiles and assigns their values 
	var $grid = $('.grid-container');
	for(var i = 0; i < 5; i++) {
		var $row = $('<div>', { class: 'grid-row' });
		for(var j = 0; j < 5; j++) {
			$cell = $('<div>', { class: 'grid-cell' });
			$cell.click(function (){ // add click handler to update tile
				updateTile($(this));
			});
			$cell.data('tileID', i * 5 + j); // set data so it's easy to manipulate later
			if((i * 5 + j) === 12) { // 'free' center tile auto-selected
				$cell.addClass('selected');
			}
			$row.append($cell);
		}
		$grid.append($row);
	}
}

function updateTile($elem) {
	if(!$elem.hasClass('selected')) {
		$elem.addClass('selected');
		// check their board to see if it completes anything
	} else {
		$elem.removeClass('selected');
	}
}