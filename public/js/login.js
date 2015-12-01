// Username colors
var colors = ['#C3423B', '#3CA29F', '#B9D9B7', '#FAA860', '#7F8E51', '#8984BF', '#A153A0', '#8B5B52', '#9BD6C8', '#27ae60', '#D27963', '#f39c12', '#8e44ad', '#1abc9c', '#e74c3c'];

// Various enter key handlers
$('#submit-username').on('keyup', function (event) {
	var key = event.which || event.keyCode;
	if(key == 13) 
		submitUsername(event);
	else 
		return;
});

$('#submit-message').on('keyup', function (event) {
	var key = event.which || event.keyCode;
	if(key == 13) 
		submitMessage(event);
	else 
		return;
});

$('.admin-password').on('keyup', function (event) {
	var key = event.which || event.keyCode;
	if(key == 13) 
		submitPassword(event);
	else 
		return;
});

/*
 * @param event (keyPress event)
 * @returns nothing if the message is a space or underscore
 * @emits data { user: userObject, msg: messageText }
 * Takes a submitted message and emits it to the entire room
 * Doesn't auto-append on the senders page (Will add) 
 */ 
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

/*
 * @param event (keyPress event)
 * @returns nothing if the message is a space or underscore
 * @emits data { userName: '', color: '' }
 * Takes the entered username and adds them to the chat room after authorization
 */ 
function submitUsername(event) {
	if($('#submit-username').val().length > 16) {
		
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

/*
 * @param event (keyPress event)
 * @returns nothing if the message is a space or underscore
 * @emits data { password: '' }
 * Emits admin password to login as admin on route /public/admin.html
 */ 
function submitPassword(event) {
	if (!$.trim($('.admin-password').val()).length) { // you need to have a username
		displayError('you need to enter your password!');
 		return;
 	} else {
		event.preventDefault();
		socket.emit(Packet.ADMIN_AUTH_NEW, {
			'password': $('.admin-password').val(),
			'userName': 'Admin',
			'color': colors[Math.floor(Math.random() * (colors.length))],
		});
	}
}

/*
 * @param string
 * Appends and capitalizes the given string to the $('.login') $el
 */ 
function displayError(errorMessage) {
	if($('.login').find('h3')) {
		$('.login').find('h3').remove();
	}
	$error = $('<h3>', {class: 'error animated fadeInUp', text: capitalize(errorMessage.toLowerCase()) });
	$('.login').append($error);
}

/*
 * @param string
 * @return str: capitalized version of the string
 */ 
function capitalize(str) {
	var first = str.substring(0, 1).toUpperCase();
	return first + str.substring(1, str.length);
}