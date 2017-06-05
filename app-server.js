const express = require("express");
const bodyparser = require("body-parser");
const http = require("http");
const ws = require("ws");

const socketClient = require("./socket-client");

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("."))

const params = {
	hostname: null,
	portnum: null,
	username: null
};

app.post("/join", (request, response) => {

	params.hostname = request.body.host;
	params.portnum = request.body.port;
	params.username = request.body.user;

	response.status(200).end();

});

const server = http.createServer(app);
const wss = new ws.Server({ server });

wss.on("connection", (ws, req) => {

	let cli = new socketClient(params.hostname, params.portnum, params.username);
	cli.connect();

	cli.on("connected", () => {

	});

	cli.on("error", (err) => {

	});

	ws.on("message", (data) => {

		cli.sendMessage("message", data, params.username);

	});

	ws.on("close", () => {
		cli.disconnect();
	});

	cli.on("join", (data) => {

		data = (data === params.username) ? "You" : data;

		ws.send(JSON.stringify({
			type: "control",
			text: data + " joined the chat room",
			identifier: ""
		}));
	});

	cli.on("leave", (data) => {

		if (data === params.username) {
			return;
		}

		ws.send(JSON.stringify({
			type: "control",
			text: data + " left the chat room"
		}));
	});

	cli.on("message", (data) => {

		data.user = (data.user === params.username) ? "You" : data.user;

		ws.send(JSON.stringify({
			type: "message",
			text: data.message,
			identifier: data.user,
			time: data.time
		}));
	});

	cli.on("userlist", (data) => {

		ws.send(JSON.stringify({
			type: "userlist",
			text: data
		}));

	});

});

server.listen(8000, function () {
	console.log("Listening on port 8000");
});