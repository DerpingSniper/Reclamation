//Canvas vars
var canvas;
CANVAS_W = 600;
CANVAS_H = 600;
var ctx;
//Player vars
var PLAYER_W = 50;
var PLAYER_H = 50;
var char = new Player(15, CANVAS_W / 2, PLAYER_W, PLAYER_H);
var gameState;
var states = {
		title: 0,
		play: 1,
		over: 2,
		shop: {
			gun: 2.5,
			noGun: 3
		},
		get: 4
	};
//Physics vars
var JUMP_SPEED = 10 + (char.boosts.jump * 50);
var MAX_FALL_SPEED = 14;
var FALL_ACCEL = .4;
var FALL_SPEED = 5;
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
var upgrade = false;
var c = false;
//BG vars
var bgpos = 0;
var bgspeed = 1;
var vx = [];
vx[0] = 0;
vx[1] = 0;
vx[2] = 0;
vx[3] = 0;
var bg = [];
//Key vars
upKey = false;
downKey = false;
fireKey = false;
//Keybinding vars
UP = 38;
DOWN = 40;
FIRE = 32;
//Image vars
bg[0] = new Image();
bg[0].src = "img/bgBack.png";
bg[1] = new Image();
bg[1].src = "img/bgMid.png";
bg[2] = new Image();
bg[2].src = "img/bgClose.png";
bg[3] = new Image();
bg[3].src = "img/bgFog.png";
var shot = new Image();
shot.src = "img/bullet.png";
var dead = new Image();
dead.src = "img/dead.png";;
var store = {
	noGun: new Image(),
	gun: new Image()
}
store.noGun.src = "img/storeNoGun.png";
store.gun.src = "img/storeGun.png";
var get = {
	gun: new Image(),
	text: new Image()
};
get.gun.src = "img/gun.png";
get.text.src = "img/getText.png";
var wText = new Image();
wText.src = "img/wText.png";
var plat = new Image();
plat.src = "img/platform.png";
var bar = {
	butt: new Image(),
	buttR: new Image(),
	cap: new Image(),
	fill: new Image()
}
bar.butt.src = "img/bButt.png";
bar.buttR.src = "img/bButtR.png";
bar.cap.src = "img/bCap.png";
bar.fill.src = "img/bFill.png";
var title = new Image();
title.src = "img/title.png";
title.onclick = function (e) {
	e = e || window.event;
	startGame(e);
};
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
	ctx.drawImage(plat, platforms[0].x, platforms[0].y, platforms[0].w, 600);
	ctx.drawImage(plat, platforms[1].x, platforms[1].y, platforms[1].w, 600);
}

function drawZombies() {
	for (var z in zombies) {
		ctx.fillStyle = "green";
		ctx.fillRect(zombies[z].x, zombies[z].y, zombies[z].w, zombies[z].h);
	}
}

function drawBullets() {
	for (var b in bullets) {
		ctx.drawImage(shot, 0 + bullets[b].frame*10, 0, 10, 5, bullets[b].x, bullets[b].y, bullets[b].w, bullets[b].h);
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
	if (gameState == states.shop.noGun) {
		ctx.drawImage(store.noGun, CANVAS_W / 2 - store.noGun.width / 2, CANVAS_H / 2 - store.noGun.height / 2);
	} else if (gameState == states.shop.gun) {
		ctx.drawImage(store.gun, CANVAS_W / 2 - store.gun.width / 2, CANVAS_H / 2 - store.gun.height / 2);
		ctx.fillStyle = "black";
		ctx.font = "24px rubberBiscuit";
		ctx.fillText(char.bPoints, (CANVAS_W / 2 - store.gun.width / 2) + 380, (CANVAS_H / 2 - store.gun.height / 2) + 375);
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

function drawBars() {
	if (gameState == states.shop.gun) {
		if (char.boosts.ammo == 4) {
			ctx.drawImage(bar.butt, 118, 181);
			ctx.drawImage(bar.fill, 127, 181, 345, bar.fill.height);
			ctx.drawImage(bar.buttR, 471, 181);
		} else if (char.boosts.ammo == 3) {
			ctx.drawImage(bar.butt, 118, 181);
			ctx.drawImage(bar.fill, 127, 181, 250, bar.fill.height);
			ctx.drawImage(bar.cap, 377, 181);
		} else if (char.boosts.ammo == 2) {
			ctx.drawImage(bar.butt, 118, 181);
			ctx.drawImage(bar.fill, 127, 181, 188, bar.fill.height);
			ctx.drawImage(bar.cap, 315, 181);
		} else if (char.boosts.ammo == 1) {
			ctx.drawImage(bar.butt, 118, 181);
			ctx.drawImage(bar.fill, 127, 181, 127, bar.fill.height);
			ctx.drawImage(bar.cap, 254, 181);
		}
		if (char.boosts.power == 4) {
			ctx.drawImage(bar.butt, 118, 231);
			ctx.drawImage(bar.fill, 127, 231, 345, bar.fill.height);
			ctx.drawImage(bar.buttR, 471, 231);
		} else if (char.boosts.power == 3) {
			ctx.drawImage(bar.butt, 118, 231);
			ctx.drawImage(bar.fill, 127, 231, 250, bar.fill.height);
			ctx.drawImage(bar.cap, 377, 231);
		} else if (char.boosts.power == 2) {
			ctx.drawImage(bar.butt, 118, 231);
			ctx.drawImage(bar.fill, 127, 231, 188, bar.fill.height);
			ctx.drawImage(bar.cap, 315, 231);
		} else if (char.boosts.power == 1) {
			ctx.drawImage(bar.butt, 118, 231);
			ctx.drawImage(bar.fill, 127, 231, 127, bar.fill.height);
			ctx.drawImage(bar.cap, 254, 231);
		}
		if (char.boosts.health == 4) {
			ctx.drawImage(bar.butt, 118, 281);
			ctx.drawImage(bar.fill, 127, 281, 345, bar.fill.height);
			ctx.drawImage(bar.buttR, 471, 281);
		} else if (char.boosts.health == 3) {
			ctx.drawImage(bar.butt, 118, 281);
			ctx.drawImage(bar.fill, 127, 281, 250, bar.fill.height);
			ctx.drawImage(bar.cap, 377, 281);
		} else if (char.boosts.health == 2) {
			ctx.drawImage(bar.butt, 118, 281);
			ctx.drawImage(bar.fill, 127, 281, 188, bar.fill.height);
			ctx.drawImage(bar.cap, 315, 281);
		} else if (char.boosts.health == 1) {
			ctx.drawImage(bar.butt, 118, 281);
			ctx.drawImage(bar.fill, 127, 281, 127, bar.fill.height);
			ctx.drawImage(bar.cap, 254, 281);
		}
		if (char.boosts.jump == 4) {
			ctx.drawImage(bar.butt, 118, 331);
			ctx.drawImage(bar.fill, 127, 331, 345, bar.fill.height);
			ctx.drawImage(bar.buttR, 471, 331);
		} else if (char.boosts.jump == 3) {
			ctx.drawImage(bar.butt, 118, 331);
			ctx.drawImage(bar.fill, 127, 331, 250, bar.fill.height);
			ctx.drawImage(bar.cap, 377, 331);
		} else if (char.boosts.jump == 2) {
			ctx.drawImage(bar.butt, 118, 331);
			ctx.drawImage(bar.fill, 127, 331, 188, bar.fill.height);
			ctx.drawImage(bar.cap, 315, 331);
		} else if (char.boosts.jump == 1) {
			ctx.drawImage(bar.butt, 118, 331);
			ctx.drawImage(bar.fill, 127, 331, 127, bar.fill.height);
			ctx.drawImage(bar.cap, 254, 331);
		}
	}
}

function drawScore() {
	if (gameState == states.play) {
		var n = char.score.toString();
		var len = n.length;
		ctx.fillStyle = "black";
		ctx.font = "24px rubberBiscuit";
		ctx.fillText(char.score, CANVAS_W / 2 - len * 24 / 2, 30);
	}
}

function drawAmmo() {
		if (gameState == states.play && char.gun) {
			var n = char.ammo.toString();
			var len = n.length;
			ctx.fillStyle = "yellow";
			ctx.font = "24px rubberBiscuit";
			ctx.fillText(char.ammo, 50 + len * 24 / 2, CANVAS_H - 50);
		}
	}
function drawLives() {
        if (gameState == states.play && char.boosts.health > 0){
            var n = char.lives.toString();
			var len = n.length;
			ctx.fillStyle = "green";
			ctx.font = "24px rubberBiscuit";
			ctx.fillText(char.lives, 550 + len * 24 / 2, CANVAS_W - 50);
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
				platforms[p].x = CANVAS_W + 200;
                platforms[p].y = Math.random()*CANVAS_H + CANVAS_H/3;
                if (platforms[p].y < CANVAS_H/2) {
                    platforms[p].y += CANVAS_H/2;
                }
                if (platforms[p].y > CANVAS_H) {
                    platforms[p].y = CANVAS_H - CANVAS_H/5;
                }
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
		moveSpeed = 5 + char.score / 1000
	}
}

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
	drawBars();
	drawScore();
	drawAmmo();
	drawLives();
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
		char.ammo = 5 + char.boosts.ammo * 5;
		zombies[0] = new Zombie(CANVAS_W - PLAYER_W - 15, char.y);
		gameState = states.play;
		for (var b in bullets) {
			bullets[b].erase();
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
	e.preventDefault();
	var rect = canvas.getBoundingClientRect();
	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;
	if (gameState == states.title) {
		gameState = states.play;
	} else if (gameState == states.over) {
		if (x > 237 && x < 371 && y > 371 && y < 413) {
			if (!char.gun) {
				gameState = states.shop.noGun;
			} else {
				gameState = states.shop.gun;
			}
		}
	} else if (gameState == states.shop.noGun) {
		if (x > 202 && x < 398 && y > 467 && y < 514) {
			char.gun = true;
			gameState = states.get;
		}
	} else if (gameState == states.shop.gun) {
		if (char.bPoints > 0) {
			if (x > 491 && x < 531) {
				if (y > 176 && y < 216) {
					char.bPoints--;
					char.boosts.ammo++;
					if (char.boosts.ammo > 4) {
						char.boosts.ammo = 4;
					}
					upgrade = "ammo";
				} else if (y > 226 && y < 266) {
					char.bPoints--;
					char.boosts.power++;
					if (char.boosts.power > 4) {
						char.boosts.power = 4;
					}
					upgrade = "power";
				} else if (y > 277 && y < 318) {
					char.bPoints--;
					char.boosts.health++;
					if (char.boosts.health > 4) {
						char.boosts.health = 4;
					}
					upgrade = "health";
				} else if (y > 327 && y < 368) {
					char.bPoints--;
					char.boosts.jump++;
					if (char.boosts.jump > 4) {
						char.boosts.jump = 4;
					}
					upgrade = "jump";
				}
			}
		}
		if (x > 217 && x < 368 && y > 472 && y < 527) {
			reset();
			char.lives = 1 + char.boosts.health;
		}
	} else if (gameState == states.get) {
		reset();
	}
}