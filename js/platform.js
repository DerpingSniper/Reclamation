var Platform = function (x, y) {
	this.x = x;
	this.y = y;
	this.w = CANVAS_W;
	this.h = CANVAS_H;
	this.move = function () {
		this.x -= moveSpeed;
		var player = this.collidePlayers();
		if (player && player.x < this.x) {
			player.x = this.x - PLAYER_W - 1;
		}
		var zombie = this.collideZombies();
		if (zombie && zombie.y < this.y) {
			if (zombie.x >= this.x + (this.w - 20)) {
				zombie.x = this.x + this.w + zombie.w;
			}
		}
		bullet = this.collideBullets();
		if (bullet) {
			bullet.erase();
		}
	}
	this.collidePlayers = function () {
		var player = char;
		if (this.collide(player)) {
			return player;
		}
		return false;
	}
	this.collideZombies = function () {
		var zombie;
		for (var z in zombies) {
			zombie = zombies[z];
			if (this.collide(zombie)) {
				return zombie;
			}
			return false;
		}
	}
	this.collideBullets = function () {
		var bullet;
		for (var b in bullets) {
			bullet = bullets[b];
			if (this.collide(bullet)) {
				return bullet
			}
		}
		return false;
	}
	this.collide = function (obj) {
		return collision(this.x, this.y, this.w, this.h, obj.x, obj.y, obj.w, obj.h);
	}
}