var packet = {
	CHAT_MESSAGE :  1,	
	USER_AUTH_NEW: 2,
	USER_AUTH_RESPONSE: 3,
	USER_JOIN: 4
};

module.exports = packet;

/*
    // Sent from both server and client, represents a chat message
    // Client -> Server, Server -> Clients in current session
    CHAT_MESSAGE:
        data { user: userObject, msg: messageText, time: timeStamp }

    // Sent from client to server when a new user wants to join
    // Client -> Server
    USER_AUTH_NEW:
        data { userName: '', color: '' }

    // Sent from server to client in response to USER_AUTH_NEW
    // Server -> Client
    USER_AUTH_RESPONSE:
        if error
            data { err: 'description of error', errCode: # }
        else 
            data { user: newUserObject }

    // Sent from server to clients except for joining client when a user joins a session
    // Server -> Client
    USER_JOIN:
        data { user: userObject }
 */