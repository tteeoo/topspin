function onKeyDown(event) {
	switch(event.keyCode) {
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
	switch(event.keyCode) {
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
