// This file defines the player object.

// TODO: refactor player

// Initialize a localController object.
function localPlayer(remotePlayerID) {
	this.rotation = 0;
}

function controller() {
	this.rotation = 0;
	this.targetX = 0;
	this.targetY = 0;
	this.speedX = 0;
	this.speedY = 0;
	this.followMouse = false;
}

function updateController() {
	// Stop if following mouse and at cursor.
	if (me.c.followMouse) {
		if (me.c.speedX > 0) {
			if (me.p.pos[0] + me.c.speedX * 4 >= me.c.targetX) {
				me.c.speedX = 0;
			}
		} else {
			if (me.p.pos[0] + me.c.speedX * 4 <= me.c.targetX) {
				me.c.speedX = 0;
			}
		}
		if (me.c.speedY > 0) {
			if (me.p.pos[1] + me.c.speedY * 4 >= me.c.targetY) {
				me.c.speedY = 0;
			}
		} else {
			if (me.p.pos[1] + me.c.speedY * 4 <= me.c.targetY) {
				me.c.speedY = 0;
			}
		}
	}

	me.c.rotation = drawPlayer(me.p.pos[0], me.p.pos[1], me.c.rotation, me.p.mass, me.p.angVel, me.p.name, "black");
}

function drawPlayer(x, y, rotation, mass, angVel, name, color) {
	var ctx = area.context;
	ctx.save();
	ctx.translate(x, y);
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
