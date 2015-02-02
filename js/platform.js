var Platform = function (x, y){
    this.x = x;
    this.y = y;
    this.w = CANVAS_W;
    this.h = CANVAS_H;
    
    this.move = function() {
        this.x-=moveSpeed;
    }
}