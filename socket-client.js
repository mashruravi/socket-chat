const net = require("net");
const events = require("events");
const util = require("util");

let socketClient = function(host, port, user) {
	this.hostname = host;
	this.portnum = port;
	this.username = user;

	events.EventEmitter.call(this);
}

util.inherits(socketClient, events.EventEmitter);

socketClient.prototype.connect = function() {

	let client = new net.Socket();
	client.connect(this.portnum, this.hostname, () => {
		this.emit("connected");
	});

}

module.exports = socketClient;