var packet = {
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

module.exports = packet;

/*
    -------------------------
    *       PROTOCOL        *
    -------------------------

    // Sent from both server and client, represents a chat message
    // Client -> Server, Server -> Clients in current session
    CHAT_MESSAGE:
        data { user: userObject, msg: '' }

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

    // Sent from client to server to request auth for password entered
    // Client -> Server
    ADMIN_AUTH_NEW:
        data { password: '', userName: '', color: '' }

    // Sent from server to client in response to ADMIN_AUTH_NEW
    // Server -> Client
    ADMIN_AUTH_RESPONSE:
        if error
            data { err: 'description of error', errCode: # }
        else 
            data { success: boolean, user: userObject }

    // Sent from client to server, represents a master winning check
    // Client -> Server
    USER_CHECK_GAME:
        data { tiles: [int] }

    // Sent from server to client, in response to USER_CHECK_GAME, 
    // represents if the player has won or not
    // Server -> Client
    USER_CHECK_RESPONSE:
        if winner 
            data { isWinner: boolean }
        else 
            data { err: 'description of error', tiles: [incorrectlySelectedTiles] }

    // Sent from client to server, represents the admin adding valid tiles
    // Client -> Server
    ADMIN_VALID_TILE:
        if valid tile 
            data { addTile: true, tileIndex: int }
        else 
            data { addTile: false, tileIndex: int }
 */