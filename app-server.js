var express = require("express");
var bodyparser = require("body-parser");

var socketClient = require("./socket-client");

var app = express();

app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("."))

app.post("/join", (request, response) => {

	var hostname = request.body.host;
	var portnum = request.body.port;
	var username = request.body.user;

	// var conn = socketClient.connect(hostname, portnum, username);
	
	// conn.then((res) => {

	// 	console.log("Success: ", res);
	// 	response.status(200).json({
	// 		status: "connected"
	// 	});

	// });
	
	// conn.catch((err) => {
	// 	console.log("Error: ", err);
	// 	response.status(500).json(err);

	// });

	let cli = new socketClient(hostname, portnum, username);
	cli.connect();

	cli.on("connected", () => {
		response.status(200).json({
			status: "conncted"
		});
	});

	cli.on("error", (err) => {
		response.status(500).json(err);
	} );

});

app.listen(8000);
console.log("Listening on port 8000");