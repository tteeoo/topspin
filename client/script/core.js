var ws;
var players = [];
var p1;
var server;
var name;
var color;

// Run every 15 ms: send player data, draw other players. 
function update() {
	ws.send(JSON.stringify(p1));

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
			updatePlayer(players[i]);
		}
	}
	updatePlayer(p1);
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

// Initialize a player object.
function player(width, height, color, x, y) {
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.color = color
	this.speedX = 0;
	this.speedY = 0;
	this.rotation = 0;
	this.angvel = Math.PI / 16;
}

// Advance and draw the given player.
function updatePlayer(player) {
	player.x += player.speedX * 4;
	player.y += player.speedY * 4;
	ctx = area.context;

	ctx.save();
	ctx.translate(player.x, player.y);
	ctx.fillText(name, 0, -player.height)
	ctx.rotate(player.rotation);
	ctx.fillStyle = player.color;
	ctx.fillRect(-player.width/2, -player.height/2, player.width, player.height);
	ctx.restore();

	player.rotation += player.angvel;
	if (player.rotation > Math.PI * 2) {
		player.rotation = player.rotation - Math.PI * 2;
	}
}

// Open WebSocket, start game.
function connect() {
	ws = new WebSocket("ws://"+server+"/ws", []);

	ws.onopen = function (event) {
		// show/hide
		area.canvas.style.display = "block";
		area.canvas.height = document.body.clientHeight;
		area.canvas.width = document.body.clientWidth;
		for (let x of document.getElementsByClassName("toHide")) {
			x.style.display = "none";
		}

		p1 = new player(30, 30, color, 100, 100);
		window.addEventListener("keydown", onKeyDown, false);
		window.addEventListener("keyup", onKeyUp, false);
		area.init();
	}

	ws.onmessage = function (event) {
		players = JSON.parse(event.data);
	}
}

function join() {
	var inputs = document.getElementsByClassName("joinInput");
	server = inputs[0].value;
	if (server == "") {
		server = "mc.theohenson.com:8080";
	}
	name = inputs[1].value;
	if (name == "") {
		name = "Player";
	}
	color = inputs[2].value;
	if (color == "") {
		color = "black";
	}
	connect();
}
