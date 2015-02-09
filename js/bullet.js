var Bullet = function (x, y) {
	this.x = x;
	this.y = y;
	this.w = 10;
	this.h = 5;
	this.speed = 20;
    this.frame = 0;
    this.tick = 0;
	this.move = function () {
		this.x += this.speed;
        this.h+=2;
        this.y--;
        this.tick++;
        if (this.tick >= 7 && this.frame < 7) {
            this.tick = 0;
            this.frame++;
        }
	}
	this.erase = function () {
		bullets.splice(0, 1);
	}
}