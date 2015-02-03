var Player = function (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    
    this.ySpeed = 0;
    this.airborn = false;
    
    this.score = 0;
    this.best = 0;
    
    this.obj;
    
    this.up = false;
    this.down = false;
    this.shoot = false;
    
    this.gun = false;
    this.ammo = 5;
    this.bulletReady = true;
    this.reloadTimer = 10;
    
    this.boosts = {
        ammo: {
            0: 5,
            1: 10,
            2: 15,
            3: 20,
            4: 25
        },
        health: {
            0: 1,
            1: 2,
            2: 3,
            3: 4,
            4: 5
        },
        jump: {
            0: JUMP_SPEED,
            1: JUMP_SPEED + 5,
            2: JUMP_SPEED + 10,
            3: JUMP_SPEED + 15,
            4: JUMP_SPEED + 20
        }
    }
    
    this.shoot = function () {
        if(this.gun && this.bulletReady && this.ammo > 0) {
            bullets[bullets.length] = new Bullet(char.x + PLAYER_W, char.y + PLAYER_H/2);
            this.reloadTimer = 0;
        }
    }
    
    this.die = function () {
        gameState = states.over;
    }
    
    this.move = function() {
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
            if (char.x <= zombie.x){
                this.die();
            }
        }
        
        if(this.airborn) {
            if(this.ySpeed < MAX_FALL_SPEED) this.ySpeed += FALL_ACCEL;
            if(this.ySpeed > MAX_FALL_SPEED) this.ySpeed = MAX_FALL_SPEED;
            else if(this.ySpeed < 0 && !this.up) this.ySpeed = 0;
        } else if(this.up) {
            this.airborn = true;
            this.ySpeed = -JUMP_SPEED;
        } else { 
            this.airborn = false;
            this.ySpeed = 0;
        }
        
        if(this.ySpeed < 0) { //moving up
            this.y += Math.floor(this.ySpeed);
            platform = this.collidePlatforms();
            if(platform) {
                this.y = platform.y + platform.h;
                this.ySpeed = 0;
                this.jumping = false;
            }
            if(this.y < 0) {
                this.y = 0;
                this.ySpeed = 0;
                this.jumping = false;
            }
        } else if(this.ySpeed > 0) { //moving down
            this.y += Math.ceil(this.ySpeed);
            platform = this.collidePlatforms();
            if(platform) {
                this.y = platform.y - this.h;
                this.ySpeed = 0;
                this.airborn = false;
            }
            if(this.y > CANVAS_H - this.h) {
                this.y = CANVAS_H - this.h;
                this.ySpeed = 0;
                this.airborn = false;
            }
        } else {
            this.y++;
            if(!(this.y > CANVAS_H - this.h)) {
                platform = this.collidePlatforms();
                if(!platform) {
                    zombie = this.collideZombies();
                    if(!zombie) {
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
    
    this.collide = function(obj) {
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