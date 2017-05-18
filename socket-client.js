let net = require("net");

let HOST = "localhost";
let PORT = 4321;

let client = new net.Socket

client.connect(PORT, HOST, () => {
	console.log("Client connect listener");
});