const express = require("express");
const bodyparser = require("body-parser");
const http = require("http");
const ws = require("ws");

const socketClient = require("./socket-client");

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("."))

let clients = [];

app.post("/join", (request, response) => {

	const hostname = "localhost";
	const portnum = 4321;
	const username = request.body.username;

	let cli = new socketClient(hostname, portnum, username);
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

		switch (msg.action) {
			case "register":
				let username = msg.data;
				clients.push({
					user: username,
					wsconn: ws
				});
				break;

			default:
				clients.forEach(e => {
					e.wsconn.send(msg.data);
				});
		}

	});

	// Remove websocket from 'clients' on close
	// ws.on("close", () => {
	// 	clients.splice(clients.indexOf)
	// });

});

server.listen(8000, function () {
	console.log("Listening on port 8000");
});