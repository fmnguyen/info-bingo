function UserStore() {
    this.users = {};
    this.userSockets = {};
}

UserStore.prototype.addUser = function(user) {
    this.users[user.name] = user;
    this.userSockets[user.socketID] = user.name;
};

UserStore.prototype.removeUser = function(user) {
    delete this.users[user.name];
    delete this.userSockets[user.socketID];
};

UserStore.prototype.getUserByUserName = function(userName) {
    return this.users[userName.toLowerCase()];
};

UserStore.prototype.getUserBySocketID = function(socketID) {
    return this.userSockets[socketID];
};

UserStore.prototype.hasUser = function(userName) {
    return this.users.hasOwnProperty(userName.toLowerCase());
};

UserStore.prototype.getUsers = function() {
    return this.users;
};

module.exports = UserStore;