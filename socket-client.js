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
		this.emit("connected");
	});

}

socketClient.prototype.disconnect = function () {
	this.client.end();
}

socketClient.prototype.sendMessage = function (message) {

}

module.exports = socketClient;