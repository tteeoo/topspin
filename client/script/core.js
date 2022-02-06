var ws;
var players = [];
var localPlayers = [];
var toDelete = [];
var me = {p: null, c: null};

// Represent the rendering area.
var area = {
	canvas: document.getElementById("area"),
	init: function() {
		this.canvas.width = document.body.clientWidth;
		this.canvas.height = document.body.clientHeight;
		this.context = this.canvas.getContext("2d");
		this.context.font = "10px monospace";
		this.interval = setInterval(update, 15);
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	},
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
} 

// Run every 15 ms: send player data, draw other players. 
function update() {
	ws.send(JSON.stringify({
		type: "Input",
		data: "{\"vel\": ["+me.c.speedX+", "+me.c.speedY+"]}"
	}));

	// Handle window resizing.
	if (document.body.clientWidth != area.canvas.width) {
		area.canvas.width = document.body.clientWidth;
	}
	if (document.body.clientHeight != area.canvas.height) {
		area.canvas.height = document.body.clientHeight;
	}

	area.clear();
	var ctx = area.context;
	ctx.save()
	ctx.textAlign = "start";
	ctx.font = "14px monospace";
	ctx.fillText("mass = " + me.p.mass, 4, 14);
	ctx.fillText("angular velocity = " + me.p.angVel, 4, 28);
	ctx.restore()

	if (localPlayers) {
		for (const i in localPlayers) {
			if (i in players) {
				var p = players[i]
				localPlayers[i].rotation = drawPlayer(p.pos[0], p.pos[1], localPlayers[i].rotation, p.mass, p.angVel, p.name, "red");
			} else {
				toDelete.push(i);
			}
		}
		for (const i in toDelete) {
			delete localPlayers[toDelete[i]];
		}
		toDelete = [];
	}
	updateController();
}

// Open WebSocket, start game.
function connect(server, name) {
	if (server == "localhost:8080") {
		ws = new WebSocket("ws://"+server+"/ws", []);
	} else {
		ws = new WebSocket("wss://"+server+"/ws", []);
	}

	// Send join request.
	ws.onopen = function (event) {
		ws.send(JSON.stringify({
			type: "JoinRequest",
			data: "{\"name\": \""+name+"\"}"
		}));
	}

	ws.onmessage = function (event) {
		var packet = JSON.parse(event.data);
		packet.data = JSON.parse(packet.data);
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
				area.init();
				break;
			case "OtherPlayers":
				players = packet.data.players;
				for (const id in players) {
					if (!(id in localPlayers)) {
						localPlayers[id] = new localPlayer();
					}
				}
				break;
			case "You":
				me.p = packet.data.you;
				if (me.c === null) {
					me.c = new controller();
				}
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
