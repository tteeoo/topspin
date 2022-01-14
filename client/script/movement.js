function onKeyDown(event) {
	me.c.followMouse = false;
	switch (event.keyCode) {
		// W, up
		case 87:
		case 38:
			me.c.speedY = -1;
			break;
		// A, left
		case 65:
		case 37:
			me.c.speedX = -1;
			break;
		// S, down
		case 83:
		case 40:
			me.c.speedY = 1;
			break;
		// D, right
		case 68:
		case 39:
			me.c.speedX = 1;
			break;
	}
}

function onKeyUp(event) {
	switch (event.keyCode) {
		// W, up, S, down
		case 87:
		case 38:
		case 83:
		case 40:
			me.c.speedY = 0;
			break;
		// A, left, D, right
		case 65:
		case 37:
		case 68:
		case 39:
			me.c.speedX = 0;
			break;
	}
}

// Set speed based on mouse position.
function onMouseMove(event) {
	me.c.followMouse = true;
	me.c.targetX = event.offsetX;
	me.c.targetY = event.offsetY;
	var distX = me.c.targetX - me.p.pos[0];
	var distY = me.c.targetY - me.p.pos[1];
	if (Math.abs(distX) > Math.abs(distY)) {
		if (distX == 0) {
			me.c.speedX = 0;
		} else if (distX > 0) {
			me.c.speedX = 1;
		} else {
			me.c.speedX = -1;
		}
		if (distY == 0) {
			me.c.speedY = 0;
		} else if (distY > 0) {
			me.c.speedY = 1 * (distY / distX);
		} else {
			me.c.speedY = -Math.abs(1 * (distY / distX));
		}
	} else {
		if (distY == 0) {
			me.c.speedY = 0;
		} else if (distY > 0) {
			me.c.speedY = 1;
		} else {
			me.c.speedY = -1;
		}
		if (distX == 0) {
			me.c.speedX = 0;
		} else if (distX > 0) {
			me.c.speedX = 1 * (distX / distY);
		} else {
			me.c.speedX = -Math.abs(1 * (distX / distY));
		}
	}
}
