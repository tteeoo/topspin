function onKeyDown(event) {
	p1.followMouse = false;
	switch (event.keyCode) {
		// W, up
		case 87:
		case 38:
			p1.speedY = -1;
			break;
		// A, left
		case 65:
		case 37:
			p1.speedX = -1;
			break;
		// S, down
		case 83:
		case 40:
			p1.speedY = 1;
			break;
		// D, right
		case 68:
		case 39:
			p1.speedX = 1;
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
			p1.speedY = 0;
			break;
		// A, left, D, right
		case 65:
		case 37:
		case 68:
		case 39:
			p1.speedX = 0;
			break;
	}
}

// Set speed based on mouse position.
function onMouseMove(event) {
	p1.followMouse = true;
	p1.targetX = event.offsetX;
	p1.targetY = event.offsetY;
	var distX = p1.targetX - p1.x;
	var distY = p1.targetY - p1.y;
	if (Math.abs(distX) > Math.abs(distY)) {
		if (distX == 0) {
			p1.speedX = 0;
		} else if (distX > 0) {
			p1.speedX = 1;
		} else {
			p1.speedX = -1;
		}
		if (distY == 0) {
			p1.speedY = 0;
		} else if (distY > 0) {
			p1.speedY = 1 * (distY / distX);
		} else {
			p1.speedY = -Math.abs(1 * (distY / distX));
		}
	} else {
		if (distY == 0) {
			p1.speedY = 0;
		} else if (distY > 0) {
			p1.speedY = 1;
		} else {
			p1.speedY = -1;
		}
		if (distX == 0) {
			p1.speedX = 0;
		} else if (distX > 0) {
			p1.speedX = 1 * (distX / distY);
		} else {
			p1.speedX = -Math.abs(1 * (distX / distY));
		}
	}
}
