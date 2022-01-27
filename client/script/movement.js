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