var statePlaying = new Kiwi.State("statePlaying");

statePlaying.preload = function() {
	Kiwi.State.prototype.preload.call(this);

	this.addImage('grass', 'images/game/image/grass.png');
	this.addImage('dirt', 'images/game/image/dirt.png');
	this.addImage('background', 'images/game/image/background.png');
	this.addImage('bullet', 'images/game/image/bullet.png');
	this.addImage('ground', 'images/game/image/ground.png');
	this.addImage('bomb', 'images/game/image/bomb.png');

	this.addSpriteSheet('characterSprite', 'images/game/image/soldier.png', 150, 117);
	this.addSpriteSheet('guns', 'images/game/image/guns.png', 150, 117);
	this.addSpriteSheet('audioOnOff', 'images/game/image/audioOnOff.png', 60, 60);
	this.addSpriteSheet('explosion', 'images/game/image/explosion.png', 129, 133);

	this.addAudio('machineGun', 'images/game/sound/machine-gun.mp3');
	this.addAudio('rifle', 'images/game/sound/rifle.mp3');
	this.addAudio('sniper', 'images/game/sound/sniper.mp3');
	this.addAudio('switchSound', 'images/game/sound/switch.mp3');
	this.addAudio('boomSound', 'images/game/sound/boom.mp3');
	this.addAudio('backgroundMusic', 'images/game/sound/background-usic.mp3');
}

statePlaying.create = function() {
	Kiwi.State.prototype.create.call(this);

	// Game Elements
	this.background = new Kiwi.GameObjects.StaticImage(this, this.textures['background'], 0, 0);

	this.character = new Soldier(this, 150, 310);
	this.gun = new Guns(this, this.character.x, this.character.y);
	this.platform = new Platform(this, 0, 475);

	this.audioToggle = new Kiwi.GameObjects.Sprite(this, this.textures["audioOnOff"], 700, 0, true);

	this.bulletGroup = new Kiwi.Group(this);
	this.bombGroup = new Kiwi.Group(this);
	this.explodeGroup = new Kiwi.Group(this);
	this.grassGroup = new Kiwi.Group(this);

	this.mouse = this.game.input.mouse;

	// HUD Elements
	this.playersHealth = new Kiwi.HUD.Widget.Bar(this.game, 100, 100, 300, 50, 80, 5);
	this.playersHealth.bar.style.backgroundColor = "#00eb21";
	this.playersHealth.style.backgroundColor = "#ff0000";

	this.score = 0;
	this.scoreBoard = new Kiwi.HUD.Widget.TextField(this.game, "Your Score: " + this.score, 10, 30);
	this.scoreBoard.style.fontFamily = "helvetica";

	this.ammoBar = new Kiwi.HUD.Widget.IconBar(this.game, this.textures["bullet"], 30, 30, 10, 10);

	// Bomb Spawn Timer
	this.timer = this.game.time.clock.createTimer("spawnTroop", 1.5, -1, true);
	this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.spawnBomb, this);

	// Audio
	this.machineGunSound = new Kiwi.Sound.Audio(this.game, "machineGun", 1, false);
	this.rifleSound = new Kiwi.Sound.Audio(this.game, "rifle", 1, false);
	this.sniperSound = new Kiwi.Sound.Audio(this.game, "sniper", 1, false);
	this.switchSound = new Kiwi.Sound.Audio(this.game, "switchSound", 1, false);
	this.boomSound = new Kiwi.Sound.Audio(this.game, "boomSound", 1, false);

	this.backgroundMusic = new Kiwi.Sound.Audio(this.game, "backgroundMusic", 0.3, true);
	this.backgroundMusic.play();

	// Controls
	this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.A);
	this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.D);
	this.reloadKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.R);

	this.oneKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.ONE);
	this.twoKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.TWO);
	this.threeKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.THREE);

	// Character Animations
	this.character.animation.add("idle", [0], 0.1, false);
	this.character.animation.add("walk", [1, 2, 3, 4, 5, 6], 0.1, true);
	this.character.animation.play("idle");

	this.audioToggle.animation.add("state", [0, 1], 0.1, false);

	// Grass Tiles
	for(var i = 0; i < 20; i++) {
		this.grassGroup.addChild(new Kiwi.GameObjects.Sprite(this, this.textures["grass"], i * 48, 475, true));
		this.grassGroup.addChild(new Kiwi.GameObjects.Sprite(this, this.textures["dirt"], i * 48, 512, true));
	}

	// Add objects to state
	this.addChild(this.platform);
	this.addChild(this.background);
	this.addChild(this.bombGroup);
	this.addChild(this.explodeGroup);
	this.addChild(this.audioToggle);
	this.addChild(this.bulletGroup);
	this.addChild(this.character);
	this.addChild(this.gun);
	this.addChild(this.grassGroup);

	// HUD
	this.game.huds.defaultHUD.addWidget(this.scoreBoard);
	this.game.huds.defaultHUD.addWidget(this.playersHealth);
	this.game.huds.defaultHUD.addWidget(this.ammoBar);
}

statePlaying.update = function() {
	Kiwi.State.prototype.update.call(this);

	this.movement();
	this.switchGun();
	this.toggleMusic();
	this.shoot();
	this.checkPlatform();
	this.checkCollisions();
	this.checkBounce();
	this.playerHealth();
}

statePlaying.movement = function() {

}

statePlaying.switchGun = function() {

}

statePlaying.toggleMusic = function() {

}

statePlaying.shoot = function() {

}

statePlaying.checkPlatform = function() {

}

statePlaying.checkCollisions = function() {

}

statePlaying.checkBounce = function() {

}

statePlaying.playerHealth = function() {

}

// Classes
var Guns = function(state, x, y) {
	Kiwi.GameObjects.Sprite.call(this, state, state.textures["guns"], x, y, false);
	this.animation.add("machineGun", [0], 0.1, false);
	this.animation.add("rifle", [1], 0.1, false);
	this.animation.add("sniper", [2], 0.1, false);
	this.animation.play("rifle");
}
Kiwi.extend(Guns, Kiwi.GameObjects.Sprite);

var Bullet = function(state, x, y, vx, vy) {
	Kiwi.GameObjects.Sprite.call(this, state, state.textures["bullet"], x, y, false);
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
	this.physics.velocity.x = vx;
	this.physics.velocity.y = vy;
}
Kiwi.extend(Bullet, Kiwi.GameObjects.Sprite);

Bullet.prototype.update = function() {
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	if(this.x > myGame.stage.width || this.x < 0) {
		this.destroy();
	}
}

var Soldier = function(state, x, y) {
	Kiwi.GameObjects.Sprite.call(this, state, state.textures["characterSprite"], x, y);

	this.animation.add("walk", [1, 2, 3, 4, 5, 6], 0.1, true);
	this.animation.play("walk");

	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
	this.physics.acceleration.y = 5;
}
Kiwi.extend(Soldier, Kiwi.GameObjects.Sprite);

var Platform = function(state, x, y) {
	Kiwi.GameObjects.Sprite.call(this, state, state.textures["ground"], x, y, true);
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
	this.physics.immovable = true;
}
Kiwi.extend(Platform, Kiwi.GameObjects.Sprite);

Platform.prototype.update = function() {
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
}

var Bomb = function(state, x, y) {
	Kiwi.GameObjects.Sprite.call(this, state, state.textures["bomb"], x, y);
	this.box.hitbox = new Kiwi.Geom.Rectangle(20, 20, 25, 25);
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
	this.physics.acceleration.y = 4;
	this.physics.velociy.x = -12;
}
Kiwi.extend(Bomb, Kiwi.GameObjects.Sprite);

Bomb.prototype.update = function() {
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	this.rotation -= 0.05;
}

Bomb.prototype.bounce = function() {
	this.physics.velociy.y = -22;
}

var Explosion = function(state, x, y) {
	Kiwi.GameObjects.Sprite.call(this, state, state.textures["explosion"], x, y);
	this.animation.add("explode", [0, 1, 2, 3, 4], 0.1, false);
	this.animation.play("explode");
}
Kiwi.extend(Explosion, Kiwi.GameObjects.Sprite);

Explosion.prototype.update = function() {
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	if (this.animation.currentCell == 4) {
		this.destroy();
	}
}
