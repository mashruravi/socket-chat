const express = require("express");
const bodyparser = require("body-parser");
const http = require("http");
const ws = require("ws");

const socketClient = require("./socket-client");

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("."))

app.post("/join", (request, response) => {

	const hostname = "localhost";
	const portnum = 4321;
	const username = request.body.username;

	let cli = new socketClient(hostname, portnum, username);
	cli.connect();

	cli.on("connected", () => {
		response.status(200).json({
			status: "conncted"
		});
	});

	cli.on("error", (err) => {
		response.status(500).json(err);
	});

});

const server = http.createServer(app);
const wss = new ws.Server({ server });

server.listen(8000, function () {
	console.log("Listening on port 8000");
});