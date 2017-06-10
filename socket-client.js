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
	let messages = data.toString().split("\n");

	messages.forEach((m) => {

		if (m === "") {
			return;
		}

		let message = JSON.parse(m);

		let myAddress = this.client.localAddress + ":" + this.client.localPort;
		let user = (message.address === myAddress) ? "You" : message.identifier;

		switch (message.action) {

			case "join":
				this.emit("join", user);
				break;

			case "leave":
				if (message.address !== myAddress) {
					this.emit("leave", message.identifier);
				}
				break;

			case "message":
				this.emit("message", {
					user: user,
					message: message.message,
					time: message.time
				});
				break;

			case "userlist":

				// Add a 'me' flag to user list to identify self in user list
				let aUsers = message.message;

				for (let i = 0; i < aUsers.length; i++) {

					let address = aUsers[i].ip + ":" + aUsers[i].port;

					if (address === myAddress) {

						aUsers[i].me = true;

					} else {

						aUsers[i].me = false;

					}
				}

				this.emit("userlist", {
					users: message.message
				});
				break;
		}
	});



}

module.exports = socketClient;