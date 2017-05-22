const net = require("net");
const events = require("events");
const util = require("util");

// let HOST = "localhost";
// let PORT = 4321;

// let client = new net.Socket();

// client.connect(PORT, HOST, () => {
// 	console.log("Client connect listener");
// });

// client.on('data', (data) => {
// 	console.log("Server says: " + data);
// });

// module.exports = {

// 	connect: function (host, port, user) {
		
// 		let client = new net.Socket();

// 		return new Promise((res, rej) => {

// 			client.connect(port, host, () => {
// 				res();
// 			});

// 		});

// 	}

// };

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