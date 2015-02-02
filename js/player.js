var Player = function (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    
    this.score = 0;
    this.best = 0;
    
    this.zoms = 0;
    
    this.obj;
    
    this.up = false;
    this.down = false;
    this.shoot = false;
    this.fall = true;    
    this.score = 0;
    this.gun = false;
    this.bulletReady = true;
    this.ammo = 0;
    this.reloadTimer = 10;
    
    this.shoot = function () {
        if(this.gun && this.bulletReady) {
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
        
        this.y++;
        platform = this.collidePlatforms();
        if (platform) {
            this.fall = false;
            this.jump = false;
            this.y--;
        } else {
            this.fall = true;
        }
        
        if (platform && this.y > platform.y) {
            this.x = platform.x - PLAYER_W - 1;
        }
        
        zombie = this.collideZombies();
        if (zombie) {
            if (char.x <= zombie.x){
                this.die();
            }
        }
        
        if (this.fall) {
            this.y += fallSpeed;
        }
        
        if (this.up && !this.jump) {
            this.y -= JUMP;
            this.jump = true;
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