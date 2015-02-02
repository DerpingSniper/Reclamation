var Bullet = function(x, y) {
    this.x = x;
    this.y = y;
    this.w = 5;
    this.h = 5;
    this.speed = 30;
    
    this.move = function () {
        this.x += this.speed;
    }
    
    this.erase = function () {
        bullets.splice(0, 1); 
    }
}