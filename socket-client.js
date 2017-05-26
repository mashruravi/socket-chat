const net = require("net");
const events = require("events");
const util = require("util");

let socketClient = function (host, port, user) {
	this.serverHostname = host;
	this.serverPortnum = port;
	this.username = user;

	events.EventEmitter.call(this);
}

util.inherits(socketClient, events.EventEmitter);

socketClient.prototype.connect = function () {

	this.client = new net.Socket();
	this.client.connect(this.serverPortnum, this.serverHostname, () => {

		// Attach event handler for data coming from server
		this.client.on("data", this.handleMessage.bind(this));

		// Send the client's username to the server
		this.sendMessage("setAlias", this.username);
		
		this.emit("connected");
	});

}

socketClient.prototype.disconnect = function () {
	this.client.end();
}

socketClient.prototype.sendMessage = function (action, message, identifier) {
	this.client.write(JSON.stringify({
		action: action,
		message: message,
		identifier: identifier
	}));
}

socketClient.prototype.handleMessage = function (data) {
	let message = JSON.parse(data);

	switch(message.action) {

		case "join":
			this.emit("join", message.identifier);
			break;

		case "leave":
			this.emit("leave", message.identifier);
			break;

		case "message":
			this.emit("message", {
				user: message.identifier,
				message: message.message
			});
			break;

	}

}

module.exports = socketClient;