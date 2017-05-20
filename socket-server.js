let net = require("net");

let HOST = "localhost";
let PORT = 4321;

let count = 0;

let connections = [];

function broadcast(message) {
	connections.forEach((e) => {
		e.write(message);
	});
}

function logConnections() {
	connections.forEach((e, i) => {
		console.log(i + " - " + e.remoteAddress + ":" + e.remotePort);
	});
}

net.createServer((sock) => {

	connections.push(sock);

	console.log("Server received connection: "
		+ sock.remoteAddress + ":" + sock.remotePort);
	count++;

	sock.write("You are client number " + count);

	sock.on('end', () => {
		console.log(sock.remoteAddress + ": " + sock.remotePort + " disconnected")
	});

	sock.on('error', (err) => {
		// Remove sock from array of connections
		logConnections();
		let index = connections.indexOf(sock);
		connections.splice(index, 1);		
		console.log("After removing erroneous connection " + sock.remoteAddress + ":" + sock.remotePort + " at index " + index);
		logConnections();
	});

	if (count == 2) {
		broadcast("You are now two!");
	}

}).listen(PORT, HOST);