var Platform = function (x, y){
    this.x = x;
    this.y = y;
    this.w = CANVAS_W;
    this.h = CANVAS_H;
    
    this.move = function() {
        this.x-=moveSpeed;
        
        var player = this.collidePlayers();        
        if (player && player.x < this.x) {
            player.x = this.x - PLAYER_W - 1;
        }
    }
    
    this.collidePlayers = function() {
        var player = char;
        
        if (this.collide(player)) {
            return player;
        }
        return false;
	}
    this.collide = function(obj) {
        return collision(this.x, this.y, this.w, this.h, obj.x, obj.y, obj.w, obj.h);
    }
}