//Canvas vars
var canvas;
CANVAS_W = 600;
CANVAS_H = 600;
var ctx;
//Player vars
var PLAYER_W = 50;
var PLAYER_H = 50;
var char = new Player(15, CANVAS_W / 2, PLAYER_W, PLAYER_H);
var fallSpeed = 5;
var gameState;
var states = {
		title: 0,
		play: 1,
		over: 2,
		shop: 3,
		get: 4,
		wait: 5
	}
	//Platform vars
var gap = 100;
platforms = [];
platforms[0] = new Platform(0, CANVAS_H / 2 + PLAYER_H);
platforms[1] = new Platform(CANVAS_W + gap, CANVAS_H / 2 + PLAYER_H + 100);
//Zombie vars
var zombies = [];
zombies[zombies.length] = new Zombie(CANVAS_W - PLAYER_W - 15, char.y);
//Misc. vars
var MAX_YSPEED = 7;
var MAX_XSPEED = 20;
var e = window.Event;
var FPS = 60;
var zoms = 0;
var bullets = [];
var moveSpeed = 5;
var tick = 0;
var title = new Image();
title.src = "img/title.png";
title.onclick = function (e) {
	e = e || window.event;
	startGame(e);
}
var dead = new Image();
dead.src = "img/dead.png";;
var store = new Image();
store.src = "img/store.png";
var get = {
	gun: new Image(),
	redLight: new Image(),
	whiteLight: new Image(),
	text: new Image()
};
get.gun.src = "img/gun.png";
get.redLight.src = "img/redLight.png";
get.whiteLight.src = "img/whiteLight.png";
get.text.src = "img/getText.png";
var wText = new Image();
wText.src = "img/wText.png";
//BG vars
var bgpos = 0;
var bgspeed = 1;
var vx = [];
vx[0] = 0;
vx[1] = 0;
vx[2] = 0;
vx[3] = 0;
var bg = [];
bg[0] = new Image();
bg[0].src = "img/bgBack.png";
bg[1] = new Image();
bg[1].src = "img/bgMid.png";
bg[2] = new Image();
bg[2].src = "img/bgClose.png";
bg[3] = new Image();
bg[3].src = "img/bgFog.png";
//Key vars
upKey = false;
downKey = false;
fireKey = false;
//Keybinding vars
UP = 38;
DOWN = 40;
FIRE = 32;
//Physics vars
var JUMP_SPEED = 10;
var MAX_FALL_SPEED = 14;
var FALL_ACCEL = .4;

function gameLoop() {
	clearCanvas();
	drawBackground();
	drawPlatforms();
	drawPlayer();
	drawBullets();
	makeZombie();
	drawZombies();
	moveStuff();
	drawTitle();
	drawOver();
	drawShop();
	drawGet();
    drawWText();
	checkScore();
}

function init() {
	canvas = document.getElementById('canvas');
	canvas.width = CANVAS_W;
	canvas.height = CANVAS_H;
	ctx = canvas.getContext('2d');
	document.addEventListener('keydown', keyDown, false);
	document.addEventListener('keyup', keyUp, false);
	canvas.onclick = function (e) {
		click(e)
	};
	gameState = states.title;
	setInterval(gameLoop, 1000 / FPS);
}

function startGame(event) {
	gameState = states.play;
}

function reset() {
		platforms[0] = new Platform(0, CANVAS_H / 2 + PLAYER_H);
		platforms[1] = new Platform(CANVAS_W + gap, CANVAS_H / 2 + PLAYER_H + 100);
		char.x = 15;
		char.y = platforms[0].y - PLAYER_H;
		char.score = 0;
		zombies[0] = new Zombie(CANVAS_W - PLAYER_W - 15, char.y);
		gameState = states.title;
	}
	//Draw Functions
function clearCanvas() {
	ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
}

function drawBackground() {
	ctx.drawImage(bg[0], vx[0], 0);
	ctx.drawImage(bg[1], vx[1], CANVAS_H - bg[1].height);
	ctx.drawImage(bg[2], vx[2], 0);
	ctx.drawImage(bg[3], vx[3], 0);
}

function drawPlayer() {
	ctx.fillStyle = "white";
	ctx.fillRect(char.x, char.y, PLAYER_W, PLAYER_H);
}

function drawPlatforms() {
	ctx.fillStyle = "grey";
	ctx.fillRect(platforms[0].x, platforms[0].y, platforms[0].w, 600);
	ctx.fillRect(platforms[1].x, platforms[1].y, platforms[1].w, 600);
}

function drawZombies() {
	for (var z in zombies) {
		ctx.fillStyle = "green";
		ctx.fillRect(zombies[z].x, zombies[z].y, zombies[z].w, zombies[z].h);
	}
}

function drawBullets() {
	for (var b in bullets) {
		ctx.fillStyle = "yellow";
		ctx.fillRect(bullets[b].x, bullets[b].y, bullets[b].w, bullets[b].h);
	}
}

function drawTitle() {
	if (gameState == states.title) {
		ctx.drawImage(title, CANVAS_W / 2 - title.width / 2, CANVAS_H / 2 - title.height / 2 - 10);
	}
}

function drawOver() {
	if (gameState == states.over) {
		ctx.drawImage(dead, CANVAS_W / 2 - dead.width / 2 + 5, CANVAS_H / 2 - dead.height / 2 + 5);
		ctx.font = "24px rubberBiscuit";
		ctx.fillStyle = "black";
		ctx.fillText(char.score, 120, 310);
		ctx.fillText(char.best, 475, 310);
	}
}

function drawShop() {
	if (gameState == states.shop) {
		ctx.drawImage(store, CANVAS_W / 2 - store.width / 2, CANVAS_H / 2 - store.height / 2);
	}
}

function drawGet() {
	if (gameState == states.get) {
		ctx.drawImage(get.text, CANVAS_W / 2 - get.text.width / 2, CANVAS_H / 2 - get.gun.height / 3);
		ctx.drawImage(get.gun, CANVAS_W / 2 - get.gun.width / 2, CANVAS_H / 2 - get.gun.height / 2);
	}
}

function drawWText() {
		if (gameState == states.wait) {
			ctx.drawImage(wText, CANVAS_W / 2 - wText.width / 2, CANVAS_H / 2 - wText.height / 2);
		}
	}
	//Game functions
function makeZombie() {
	if (!zombies.length) {
		zombies[zombies.length] = new Zombie(CANVAS_W + 1, platforms[0].y - PLAYER_H);
	}
}

function moveStuff() {
	if (gameState == states.play) {
		char.move();
		for (var z in zombies) {
			zombies[z].move();
		}
		for (var p in platforms) {
			platforms[p].move();
			if (platforms[p].x <= -platforms[p].w) {
				platforms[p].x = CANVAS_W + 100;
			}
		}
		for (var b in bullets) {
			bullets[b].move();
		}
		vx[0] --;
		vx[1] -= 2;
		vx[2] -= 3;
		vx[3] -= 5;
	}
	for (var x in vx) {
		if (vx[x] <= -CANVAS_W) {
			vx[x] = 0;
		}
	}
	if (platforms[0].y < 250) {
		platforms[0].y -= 200;
	}
	if (platforms[1].y < 250) {
		platforms[1].y -= 200;
	}
}

function checkScore() {
		if (gameState == states.play) {
			tick++;
			if (tick >= 5) {
				char.score++;
				tick = 0;
			}
			if (char.score > char.best) {
				char.best = char.score;
			}
		}
	}
	//Input functions
function keyDown(e) {
	if (e.keyCode == DOWN) {
		e.preventDefault();
		downKey = true;
	} else if (e.keyCode == UP) {
		e.preventDefault();
		upKey = true;
	}
	if (e.keyCode == FIRE) {
		e.preventDefault();
		fireKey = true;
	}
}

function keyUp(e) {
	if (e.keyCode == DOWN) {
		e.preventDefault();
		downKey = false;
	} else if (e.keyCode == UP) {
		e.preventDefault();
		upKey = false;
	}
	if (e.keyCode == FIRE) {
		e.preventDefault();
		fireKey = false;
	}
}

function click(e) {
	var rect = canvas.getBoundingClientRect();
	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;
	if (gameState == states.title) {
		gameState = states.play;
	} else if (gameState == states.over) {
        if (x > 237 && x < 371 && y > 371 && y < 413) {
            if (!char.gun) {
                gameState = states.shop;
            } else {
                gameState = states.wait;
            }
        }
	} else if (gameState == states.shop) {
        if (x > 202 && x < 398 && y > 467 && y < 514){
            if (!char.gun) {
                char.gun = true;
                gameState = states.get;
            } else {
                gameState = states.wait;
            }
        }
	} else if (gameState == states.get) {
		gameState = states.wait;
	} else if (gameState == states.wait) {
		reset();
	}
}