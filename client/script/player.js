// This file defines the player object.

// TODO: refactor player

// Initialize a player object.
function player(color, x, y) {

	this.mass = 40;
	this.id = 0;
	this.x = x;
	this.y = y;
	this.speedX = 0;
	this.speedY = 0;
	this.rotation = 0;
	this.angvel = Math.PI / 16;
	this.targetX = 0;
	this.targetY = 0;
	this.followMouse = false;

	// Advance and draw the given player.
	// Take the area to draw on as an argument.
	this.update = function(area) {
		// Stop if following mouse and at cursor.
		if (this.followMouse) {
			if (this.speedX > 0) {
				if (this.x + this.speedX * 4 >= this.targetX) {
					this.speedX = 0;
				}
			} else {
				if (this.x + this.speedX * 4 <= this.targetX) {
					this.speedX = 0;
				}
			}
			if (this.speedY > 0) {
				if (this.y + this.speedY * 4 >= this.targetY) {
					this.speedY = 0;
				}
			} else {
				if (this.y + this.speedY * 4 <= this.targetY) {
					this.speedY = 0;
				}
			}
		}
		this.x += this.speedX * 4;
		this.y += this.speedY * 4;

		var ctx = area.context;

		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.fillText(name, 0, -this.height)
		ctx.rotate(this.rotation);
		ctx.fillStyle = "black";
		ctx.fillRect(-this.mass/2, -this.mass/2, this.mass, this.mass);
		ctx.restore();

		this.rotation += this.angvel;
		if (this.rotation > Math.PI * 2) {
			this.rotation = this.rotation - Math.PI * 2;
		}
	}
}
