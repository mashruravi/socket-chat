const express = require("express");
const bodyparser = require("body-parser");
const http = require("http");
const ws = require("ws");

const socketClient = require("./socket-client");

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("."))

let cli = null;

app.post("/join", (request, response) => {

	const hostname = request.body.host;
	const portnum = request.body.port;
	const username = request.body.user;

	cli = new socketClient(hostname, portnum, username);
	cli.connect();

	cli.on("connected", () => {
		response.status(200).json({
			status: "connected"
		});
	});

	cli.on("error", (err) => {
		response.status(500).json(err);
	});

});

const server = http.createServer(app);
const wss = new ws.Server({ server });

wss.on("connection", (ws, req) => {

	ws.on("message", (data) => {

		let msg = JSON.parse(data);

	});

	ws.on("close", () => {
		cli.disconnect();
	});

});

server.listen(8000, function () {
	console.log("Listening on port 8000");
});