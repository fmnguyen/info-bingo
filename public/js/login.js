var colors = ['#C3423B', '#3CA29F', '#B9D9B7', '#FAA860', '#7F8E51', '#8984BF', '#A153A0', '#8B5B52', '#9BD6C8', '#27ae60', '#D27963', '#f39c12', '#8e44ad', '#1abc9c', '#e74c3c'];

$('#submit-user').click(function (event) {
	submitUsername(event);
});

$('#submit-username').on('keyup', function (event) {
	var key = event.which || event.keyCode;
	if(key == 13) 
		submitUsername(event);
	else 
		return;
});

$('#submit-button').click(function (event) {
	submitMessage(event);
});

$('#submit-message').on('keyup', function (event) {
	var key = event.which || event.keyCode;
	if(key == 13) 
		submitMessage(event);
	else 
		return;
});

// Emits message out to server and updates the message to the local version
function submitMessage(event) {
	event.preventDefault();
	if(!$.trim($('#submit-message').val()).length) { //if 0 length string don't emit
		return;
	} else {
		socket.emit(Packet.CHAT_MESSAGE, {
			'user': user,
			'msg': $('#submit-message').val()
		});	
		$('#submit-message').val('');
	}
}

// Emits username to server to join chatroom
function submitUsername(event) {
	if($('#submit-username').val().length > 16) {
		// throw username too long error
 	} else if (!$.trim($('#submit-username').val()).length) { // you need to have a username
 		return;
 	} else {
		event.preventDefault();
		socket.emit(Packet.USER_AUTH_NEW, {
			'userName': $('#submit-username').val(),
			'color': colors[Math.floor(Math.random() * (colors.length))],
		});
	}
}