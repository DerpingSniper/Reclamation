var Zombie = function (x, y) {
	this.x = x;
	this.y = y;
	this.w = PLAYER_W;
	this.h = PLAYER_H;
	this.fall = false;
	this.move = function () {
		if (this.x < -this.w) {
			this.erase();
		}
		if (this.y > CANVAS_H) {
			this.erase();
		}
		this.y++;
		platform = this.collidePlatforms();
		if (platform) {
			if (this.y + this.h + 2 >= platform.y) {
				this.fall = false;
                this.y = platform.y - this.h;
			}
		} else {
			this.fall = true;
		}
		bullet = this.collideBullets();
		if (bullet) {
			this.die();
			bullet.erase();
		}
		if (this.fall) {
			this.y += FALL_SPEED;
			this.x -= moveSpeed + 0.1;
		} else {
			this.x -= moveSpeed + 1;
		}
	}
	this.die = function () {
		char.score += 20 * (char.boosts.power + 1);
		zombies.splice(zombies[0], 1);
	}
	this.erase = function () {
		zombies.splice(zombies[0], 1);
	}
	this.collide = function (obj) {
		return collision(this.x, this.y, this.w, this.h, obj.x, obj.y, obj.w, obj.h);
	}
	this.collidePlatforms = function () {
		var platform;
		for (var p in platforms) {
			platform = platforms[p];
			if (this.collide(platform)) {
				return platform;
			}
		}
		return false;
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
}