let net = require("net");
let ip = require("ip");

let HOST = ip.address();
let PORT = 4321;

let count = 0;

let connections = [];

function broadcast(message) {
	connections.forEach((e) => {
		e.sock.write(JSON.stringify(message));
	});
}

function logConnections() {
	console.log("\nRemaining connections: ");
	connections.forEach((e, i) => {
		console.log(e.alias + " - " + e.sock.remoteAddress + ":" + e.sock.remotePort);
	});
}

function removeConnection(conn) {
	let index = connections.findIndex((e) => {
		return e.sock === conn;
	});
	let name = connections[index].alias;
	connections.splice(index, 1);
	broadcast({
		action: "leave",
		identifier: name,
		message: ""
	});
}

net.createServer((sock) => {

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

	sock.on('data', (data) => {
		let info = JSON.parse(data.toString());

		switch (info.action) {

			case "setAlias":
				connections.push({
					alias: info.message,
					sock: sock
				});
				broadcast({
					action: "join",
					identifier: info.message,
					message: ""
				});
				break;

		}

		logConnections();
	});

}).listen(PORT, HOST);

console.log("Listening on " + HOST + ":" + PORT);