let net = require("net");
let ip = require("ip");

let HOST = ip.address();
let PORT = 4321;

let count = 0;

let connections = [];

function broadcast(message) {
	connections.forEach((e) => {
		e.write(message);
	});
}

function logConnections() {
	console.log("\nRemaining connections: ");
	connections.forEach((e, i) => {
		console.log(i + " - " + e.remoteAddress + ":" + e.remotePort);
	});
}

function removeConnection(conn) {
	let index = connections.indexOf(conn);
	connections.splice(index, 1);
}

net.createServer((sock) => {

	connections.push(sock);

	console.log("Server received connection: "
		+ sock.remoteAddress + ":" + sock.remotePort);
	count++;

	sock.write("You are client number " + count);

	sock.on('end', () => {
		console.log(sock.remoteAddress + ": " + sock.remotePort + " disconnected");
		removeConnection(sock);
		logConnections();
	});

	sock.on('error', (err) => {
		// Remove sock from array of connections
		removeConnection(sock);
		console.log("Error from connection " + sock.remoteAddress + ":" + sock.remotePort);
		logConnections();
	});

}).listen(PORT, HOST);

console.log("Listening on " + HOST + ":" + PORT);