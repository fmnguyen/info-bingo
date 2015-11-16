function User(name, color, socketID) {
	this.displayName = name;
	this.name = name.toLowerCase();
	this.color = color;
	this.socketID = socketID;
}

User.prototype.getDisplayName = function() {
    return this.name;
};

User.prototype.getSocketID = function() {
    return this.socketID;
};

User.prototype.getColor = function() {
    return this.color;
};

User.prototype.setDisplayName = function(name) {
    this.displayName = name;
    this.name = name.toLowerCase();
};

User.prototype.getName = function() {
    return this.name;
};

module.exports = User;
