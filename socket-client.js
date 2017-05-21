let net = require("net");

// let HOST = "localhost";
// let PORT = 4321;

// let client = new net.Socket();

// client.connect(PORT, HOST, () => {
// 	console.log("Client connect listener");
// });

// client.on('data', (data) => {
// 	console.log("Server says: " + data);
// });

module.exports = {

	connect: function (host, port, user) {
		
		let client = new net.Socket();

		return new Promise((res, rej) => {

			client.connect(port, host, () => {
				res();
			});

		});

	}

};