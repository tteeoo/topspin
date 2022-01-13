var ws;
var players = [];
var p1;

// Run every 15 ms: send player data, draw other players. 
function update() {
	ws.send(JSON.stringify({
		"type": "Input",
		"data": {
			"vel": [p1.speedX, p1.speedY]
		}
	}));

	// Handle window resizing.
	if (document.body.clientWidth != area.canvas.width) {
		area.canvas.width = document.body.clientWidth;
	}
	if (document.body.clientHeight != area.canvas.height) {
		area.canvas.height = document.body.clientHeight;
	}

	area.clear();
	if (players) {
		for (var i = 0; i < players.length; i++) {
			players[i].update(area);
		}
	}
	p1.update(area);
}

// Represent the rendering area.
var area = {
	canvas: document.getElementById("area"),
	init: function() {
		this.canvas.width = document.body.clientWidth;
		this.canvas.height = document.body.clientHeight;
		this.context = this.canvas.getContext("2d");
		this.context.font = "12px Arial";
		this.context.textAlign = "center";
		this.interval = setInterval(update, 15);
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	},
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
} 

// Open WebSocket, start game.
function connect(server, name) {
	ws = new WebSocket("ws://"+server+"/ws", []);

	// Send join request.
	ws.onopen = function (event) {
		"type": "JoinRequest",
		"data": {
			"name": name
		}
	}

	ws.onmessage = function (event) {
		var packet = JSON.parse(event.data);
		// Handle different types of packets.
		switch (packet.type) {
			case "JoinResponse":
				if (!packet.data.valid) {
					// TODO: bad username
					return
				}

				// Show/hide join menu.
				area.canvas.style.display = "block";
				area.canvas.height = document.body.clientHeight;
				area.canvas.width = document.body.clientWidth;
				for (let x of document.getElementsByClassName("toHide")) {
					x.style.display = "none";
				}

				// Initialize canvas and event listeners.
				window.addEventListener("keydown", onKeyDown, false);
				window.addEventListener("keyup", onKeyUp, false);
				window.addEventListener("mousemove", onMouseMove, false);
				area.init();
				break;
			case "OtherPlayers":
				// TODO: add local data
				players = packet.data.players;
				break;
			case "You":
				p1 = packet.data.player;
				break;
			case "DelPlayer":
				// TODO remove local data
				break;
			default:
				console.log("bad packet", packet.type);
				break;
		}
	}
}

function join() {
	var inputs = document.getElementsByClassName("joinInput");
	var name = inputs[0].value;
	var server = inputs[1].value;
	if (server == "") {
		server = "topspin.theohenson.com";
	}
	if (name.trim() != "") {
		connect(server, name);
	}
}
