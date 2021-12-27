// Initialize the game.
function init() {
	p1 = new player(30, 30, "black", 100, 100);
	window.addEventListener("keydown", this.onKeyDown, false);
	window.addEventListener("keyup", this.onKeyUp, false);
	area.init();
	players = [];
}

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
	for (var i = 0; i < players.length; i++) {
		updatePlayer(players[i]);
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
		this.interval = setInterval(update, 15);
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	},
	clear : function() {
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
}

// Advance and draw the given player.
function updatePlayer(player) {
	player.x += player.speedX * 4;
	player.y += player.speedY * 4;
	ctx = area.context;
	ctx.fillStyle = player.color;
	ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Open WebSocket, start game.
var ws = new WebSocket("ws://localhost:8080/ws", []);
ws.onmessage = function (event) {
	players = JSON.parse(event.data);
}
ws.onopen = function (event) {
	init();
}
