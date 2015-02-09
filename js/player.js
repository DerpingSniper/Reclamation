var Player = function (x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.ySpeed = 0;
	this.airborn = false;
	this.lives = 01;
	this.score = 0;
	this.best = 00;
	this.bPoints = 0;
	this.obj;
	this.up = false;
	this.down = false;
	this.shoot = false;
	this.gun = false;
	this.ammo = 5;
	this.bulletReady = true;
	this.reloadTimer = 10;
	this.boosts = {
		ammo: 0,
		power: 0,
		health: 0,
		jump: 0
	}
	this.bo = this.boosts.ammo.toString() + this.boosts.power.toString() + this.boosts.health.toString() + this.boosts.jump.toString();
	this.be = this.best.toString();
	this.cookieData = this.bo + this.be;
	this.shoot = function () {
		if (this.gun && this.bulletReady && this.ammo > 0) {
			bullets[bullets.length] = new Bullet(char.x + PLAYER_W, char.y + PLAYER_H / 2);
			this.reloadTimer = 0;
			this.ammo--;
		}
	}
	this.die = function () {
		this.lives--;
		if (this.lives <= 0) {
			gameState = states.over;
			this.bPoints += Math.floor(this.score / 200);
		} else {
			reset();
		}
		this.save();
	}
	this.save = function () {
		$.removeCookie("Reclamation Game Data");
		$.cookie("Reclamation Game Data", this.cookieData);
	}
	this.move = function () {
			if (this.reloadTimer >= 50) {
				this.reloadTimer = 50;
				this.bulletReady = true;
			} else {
				this.reloadTimer++;
				this.bulletReady = false;
			}
			if (upKey) {
				this.up = true;
			} else {
				this.up = false;
			}
			if (fireKey) {
				this.shoot();
			}
			if (this.y > CANVAS_H) {
				this.die();
			}
			if (this.x <= -PLAYER_W) {
				this.die();
			}
			zombie = this.collideZombies();
			if (zombie) {
				if (char.x <= zombie.x) {
					this.die();
				}
			}
			if (this.airborn) {
				if (this.ySpeed < MAX_FALL_SPEED) this.ySpeed += FALL_ACCEL;
				if (this.ySpeed > MAX_FALL_SPEED) this.ySpeed = MAX_FALL_SPEED;
				else if (this.ySpeed < 0 && !this.up) this.ySpeed = 0;
			} else if (this.up) {
				this.airborn = true;
				this.ySpeed = -JUMP_SPEED;
			} else {
				this.airborn = false;
				this.ySpeed = 0;
			}
			if (this.ySpeed < 0) { //moving up
				this.y += Math.floor(this.ySpeed);
				platform = this.collidePlatforms();
				if (platform) {
					this.y = platform.y + platform.h;
					this.ySpeed = 0;
					this.jumping = false;
				}
			} else if (this.ySpeed > 0) { //moving down
				this.y += Math.ceil(this.ySpeed);
				platform = this.collidePlatforms();
				if (platform) {
					this.y = platform.y - this.h;
					this.ySpeed = 0;
					this.airborn = false;
				}
			} else {
				this.y++;
				if (!(this.y > CANVAS_H - this.h)) {
					platform = this.collidePlatforms();
					if (!platform) {
						zombie = this.collideZombies();
						if (!zombie) {
							this.airborn = true;
						} else {
							this.y--;
						}
					} else {
						this.y--;
					}
				} else {
					this.y--;
				}
			}
		}
		//collision functions
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
	this.collideZombies = function () {
		var zombie;
		for (var z in zombies) {
			zombie = zombies[z];
			if (this.collide(zombie)) {
				return zombie;
			}
		}
		return false;
	}
}