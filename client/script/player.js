// This file defines the player object.

// Initialize a localController object.
function localPlayer(remotePlayerID) {
	this.rotation = 0;
}

function controller() {
	this.rotation = 0;
	this.speedX = 0;
	this.speedY = 0;
}

function updateController() {
	me.c.rotation = drawPlayer(me.p.pos[0], me.p.pos[1], me.c.rotation, me.p.mass, me.p.angVel, me.p.name, "black");
}

function drawPlayer(x, y, rotation, mass, angVel, name, color) {
	var ctx = area.context;
	ctx.save();
	ctx.translate(x, y);
	ctx.textAlign = "center";
	ctx.fillText(name, 0, -mass)
	ctx.rotate(rotation);
	ctx.fillStyle = color;
	ctx.fillRect(-mass/2, -mass/2, mass, mass);
	ctx.restore();

	rotation += angVel;
	if (rotation > Math.PI * 2) {
		rotation = rotation - Math.PI * 2;
	}
	return rotation;
}
