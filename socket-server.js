let net = require("net");

let HOST = "localhost";
let PORT = 4321;

net.createServer((sock) => {

	console.log("Server received connection: "
		+ sock);

}).listen(PORT, HOST);