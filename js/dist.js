var DEBUG = false;

var SCREEN_WIDTH = 480;
var SCREEN_HEIGHT = 480;

var PLAYER_SPEED = 200;
var PLAYER_SWING_SWORD_KEY = Phaser.Input.Keyboard.KeyCodes.Z;
var PLAYER_SWORD_LENGTH = 15;

var ENEMY_OFFSET_X = 8;
var ENEMY_OFFSET_Y = 8;
var ENEMY_PATH_TIMER = 10;
var ENEMY_DEATH_TIME = 0.5;

var ENEMY_MIN_SPAWN_TIMER = 0.5;
var ENEMY_MAX_SPAWN_TIMER = 2;
var ENEMY_MAX_DIFFICULTY_SCORE = 1500;

var FAMILY_PANIC_DISTANCE = 60;

Player = function(game) {
	this.game = game;

	this.sprite = game.physics.add.sprite(250, 275, 'player');
	this.sprite.setCollideWorldBounds(true);
	this.sprite.setDepth(3);

	game.anims.create({
		key: 'playerRight',
		frames: [{ key: 'player', frame: 0 }],
		frameRate: 20
	});

	game.anims.create({
		key: 'playerUp',
		frames: [{ key: 'player', frame: 1 }],
		frameRate: 20
	});

	game.anims.create({
		key: 'playerLeft',
		frames: [{ key: 'player', frame: 2 }],
		frameRate: 20
	});

	game.anims.create({
		key: 'playerDown',
		frames: [{ key: 'player', frame: 3 }],
		frameRate: 20
	});

	this.swingingSword = false;
	this.swordSwingKey = game.input.keyboard.addKey(PLAYER_SWING_SWORD_KEY);
};

Player.prototype = {
	update: function() {
		this.move();

		if(this.swingingSword) {
			this.moveSword();
		} else if(Phaser.Input.Keyboard.JustDown(this.swordSwingKey)) {
			this.swingSword();
		}
	},

	move: function() {
		var px = 0;
		var py = 0;

		if(cursors.left.isDown) px -= 1;
		if(cursors.right.isDown) px += 1;
		if(cursors.up.isDown) py -= 1;
		if(cursors.down.isDown) py += 1;

		if(px < 0) this.sprite.anims.play('playerLeft', true);
		if(px > 0) this.sprite.anims.play('playerRight', true);
		if(py < 0) this.sprite.anims.play('playerUp', true);
		if(py > 0) this.sprite.anims.play('playerDown', true);

		var pv = new Phaser.Math.Vector2(px, py);
		pv.normalize();
		pv.scale(PLAYER_SPEED);

		this.sprite.body.setVelocityX(pv.x);
		this.sprite.body.setVelocityY(pv.y);
	},

	swingSword: function() {
		this.swingingSword = true;
		this.moveSword();
		playerSword.play('swordStrike', true, 0);
	},

	moveSword: function() {
		var coordinates = this.getSwordCoordinates();
		var x = this.sprite.x + coordinates.x;
		var y = this.sprite.y + coordinates.y;
		var angle = coordinates.angle();

		playerSword.setPosition(x, y);
		playerSword.setRotation(angle);
	},

	getSwordCoordinates: function() {
		var coordinates = new Phaser.Math.Vector2();
		var velocity = this.sprite.body.velocity.clone();
		var x = 0;
		var y = 0;

		if(velocity.length() == 0) { // Player standing still
			var facing = this.sprite.anims.getCurrentKey();

			switch(facing) {
				case 'playerLeft':
					x -= 1;
					break;
				case 'playerRight':
					x += 1;
					break;
				case 'playerUp':
					y -= 1;
					break;
				case 'playerDown':
					y += 1;
					break;
				default:
					x += 1;
			}

			coordinates.x = x;
			coordinates.y = y;
		} else {
			coordinates.x = velocity.x;
			coordinates.y = velocity.y;
		}

		coordinates.normalize();
		coordinates.scale(PLAYER_SWORD_LENGTH);
		return coordinates;
	}
};

Enemies = function(game) {
	this.game = game;

	game.anims.create({
		key: 'enemyRight',
		frames: [{ key: 'enemy', frame: 0 }],
		frameRate: 20
	});

	game.anims.create({
		key: 'enemyUp',
		frames: [{ key: 'enemy', frame: 1 }],
		frameRate: 20
	});

	game.anims.create({
		key: 'enemyLeft',
		frames: [{ key: 'enemy', frame: 2 }],
		frameRate: 20
	});

	game.anims.create({
		key: 'enemyDown',
		frames: [{ key: 'enemy', frame: 3 }],
		frameRate: 20
	});

	game.anims.create({
		key: 'enemyInvincible',
		frames: [{ key: 'enemy', frame: 4 }],
		frameRate: 20
	})

	this.enemies = game.physics.add.group();

	this.buildPaths();
	game.physics.add.collider(this.enemies, walls);
	game.physics.add.collider(playerSword, this.enemies, strikeEnemy);

	this.spawnTimer = ENEMY_MAX_SPAWN_TIMER;

	this.spawnEnemy();
};

Enemies.prototype = {
	update: function(delta) {
		delta = delta / 1000;
		this.updateSpawnTimer(delta);
		this.updateEnemies(this.game, delta);
	},

	buildPaths: function() {
		var paths = new Array();

		var pathSources = new Array();
		pathSources.push(map.getObjectLayer('Paths Basic')['objects']);
		pathSources.push(map.getObjectLayer('Paths Simple')['objects']);
		pathSources.push(map.getObjectLayer('Paths Simple Longer')['objects']);
		pathSources.push(map.getObjectLayer('Paths Medium Vertical')['objects']);
		pathSources.push(map.getObjectLayer('Paths Medium Horizontal')['objects']);
		pathSources.push(map.getObjectLayer('Paths Complex One')['objects']);
		pathSources.push(map.getObjectLayer('Paths Complex Two')['objects']);
		pathSources.push(map.getObjectLayer('Paths Complex Three')['objects']);

		pathSources.forEach(function(pathSource) {
			pathSource.forEach(function(line) {
				var originX = line.x;
				var originY = line.y;
				var points = line.polyline;
				var pathX = new Array();
				var pathY = new Array();
				points.forEach(function(point) {
					pathX.push(originX + point.x);
					pathY.push(originY + point.y);
				});

				paths.push({
					'x': pathX,
					'y': pathY
				});
			});
		});

		this.paths = paths;
	},

	updateSpawnTimer: function(delta) {
		this.spawnTimer -= delta;
		if(this.spawnTimer <= 0) {
			this.spawnEnemy();
			this.resetSpawnTimer();
		}
	},

	spawnEnemy: function() {
		var path = this.paths[Phaser.Math.RND.between(0, this.paths.length - 1)];
		var startPointX = path.x[0];
		var startPointY = path.y[0];

		var enemy = this.enemies.create(startPointX, startPointY, 'enemy');
		enemy.setDepth(2);
		enemy.setData('path', path);
		enemy.setData('timer', 0);
		enemy.setData('dead', false);
		enemy.setData('deathTimer', ENEMY_DEATH_TIME);
	},

	updateEnemies: function(game, delta) {
		var reachedFamily = false;
		var manager = this;

		this.enemies.children.iterate(function(enemy) {
			var timer = enemy.getData('timer');
			var dead = enemy.getData('dead');
			var deathTimer = enemy.getData('deathTimer');

			if(dead) {
				enemy.anims.play('enemyInvincible', true);
				deathTimer -= delta;
				enemy.setData('deathTimer', deathTimer);
			} else if(timer < ENEMY_PATH_TIMER) {
				var source = new Phaser.Geom.Point(enemy.x, enemy.y);
				var path = enemy.getData('path');

				timer += delta;
				var distance = timer / ENEMY_PATH_TIMER;
				var dest = new Phaser.Geom.Point(
					Phaser.Math.Interpolation.Linear(path.x, distance),
					Phaser.Math.Interpolation.Linear(path.y, distance)
				);

				var angle = Phaser.Math.Angle.BetweenPoints(source, dest);
				if(angle < 0) {
					angle += Phaser.Math.PI2;
				}

				var facingAnim = 'enemyUp';
				if(angle < Math.PI * 1/4 || angle > Math.PI * 7/4) {
					facingAnim = 'enemyRight';
				} else if(angle < Math.PI * 3/4 && angle > Math.PI * 1/4) {
					facingAnim = 'enemyDown';
				} else if(angle < Math.PI * 5/4 && angle > Math.PI * 3/4) {
					facingAnim = 'enemyLeft';
				}

				enemy.x = dest.x;
				enemy.y = dest.y;
				enemy.setData('timer', timer);
				enemy.anims.play(facingAnim, true);
			} else {
				reachedFamily = true;
			}
		});

		if(reachedFamily) {
			this.game.loseGame();
		}

		this.enemies.children.iterate(function(enemy) {
			if(enemy) {
				var deathTimer = enemy.getData('deathTimer');
				if(deathTimer <= 0) {
					enemy.destroy();
				}
			}
		})
	},

	resetSpawnTimer: function() {
	  if (score > ENEMY_MAX_DIFFICULTY_SCORE) {
			this.spawnTimer = ENEMY_MIN_SPAWN_TIMER;
		} else {
			var progress = score / ENEMY_MAX_DIFFICULTY_SCORE;
			var timers = [ENEMY_MAX_SPAWN_TIMER, ENEMY_MIN_SPAWN_TIMER];
			this.spawnTimer = Phaser.Math.Interpolation.Linear(timers, progress);
		}
	},

	closingIn: function(x, y, dist) {
		var close = false;

		this.enemies.children.iterate(function(enemy) {
			if(Phaser.Math.Distance.Between(enemy.x, enemy.y, x, y) < dist) {
				close = true;
			}
		});

		return close;
	}
};

var scenePlaying = new Phaser.Scene('Playing');

scenePlaying.preload = function() {
	this.load.tilemapTiledJSON('map', '/images/game/config/map.json');
	this.load.spritesheet('floor', '/images/game/image/floor.png', { frameWidth: 8, frameHeight: 8 });
	this.load.image('wall', '/images/game/image/wall.png');

	this.load.spritesheet('player', '/images/game/image/player.png', { frameWidth: 16, frameHeight: 16 });
	this.load.spritesheet('enemy', '/images/game/image/enemy.png', { frameWidth: 16, frameHeight: 16 });
	this.load.spritesheet('family', '/images/game/image/family.png', { frameWidth: 16, frameHeight: 16 });
	this.load.spritesheet('sword-strike', '/images/game/image/sword-strike.png', { frameWidth: 24, frameHeight: 24 });
}

scenePlaying.create = function() {
	cursors = this.input.keyboard.createCursorKeys();
  score = 0;

	this.anims.create({
		key: 'familyCalm',
		frames: [{ key: 'family', frame: 0 }],
		frameRate: 20
	});

	this.anims.create({
		key: 'familyScared',
		frames: [{ key: 'family', frame: 1 }],
		frameRate: 20
	});

	this.anims.create({
		key: 'familyDead',
		frames: [{ key: 'family', frame: 2 }],
		frameRate: 20
	});

	this.anims.create({
		key: 'swordStrike',
		frames: this.anims.generateFrameNumbers('sword-strike', { start: 0, end: 3 }),
		frameRate: 30
	});

	map = this.make.tilemap({ key: 'map' });
	var floorTiles = map.addTilesetImage('Floor', 'floor');
	floorLayer = map.createStaticLayer('Floor', floorTiles, 0, 0);

	this.buildWalls();

	playerSword = this.physics.add.sprite(-100, -100, 'sword-strike');
	playerSword.on('animationcomplete', playerSwordSwingComplete, playerSword);
	player = new Player(this);
	enemies = new Enemies(this);
	family = this.physics.add.sprite(240, 240, 'family');
	family.setDepth(4);
	family.anims.play('familyCalm', true);

	this.physics.add.collider(player.sprite, walls);

	scoreText = this.add.text(8, 5, 'Blood Spilled: ' + score, { fontSize: '12px', fill: '#FFF' });;

	this.playing = true;
}

scenePlaying.buildWalls = function() {
	var mapWalls = map.getObjectLayer('Walls')['objects'];
	walls = this.physics.add.staticGroup();
	mapWalls.forEach(function(mapWall) {
		var wall = walls.create(mapWall.x, mapWall.y, 'wall');
		wall.setScale(mapWall.width / 8, mapWall.height / 8);
		wall.setOrigin(0);
		wall.setDepth(1);
		wall.body.width = mapWall.width;
		wall.body.height = mapWall.height;
	});

	walls.refresh();
}

scenePlaying.update = function(time, delta) {
	if(this.playing) {
		player.update();
		enemies.update(delta);
		this.updateFamily();
	}
}

scenePlaying.updateFamily = function() {
	if(this.playing) {
		var animation = 'familyCalm';
		if(enemies.closingIn(family.x, family.y, FAMILY_PANIC_DISTANCE)) {
			animation = 'familyScared';
		}

		family.anims.play(animation, true);
	}
}

scenePlaying.loseGame = function() {
	family.anims.play('familyDead', true);
  this.playing = false;
  this.scene.launch('GameOver');
}

var sceneGameOver = new Phaser.Scene('GameOver');

var highScores = new Array();

sceneGameOver.preload = function() {
  this.load.image('background', '/images/game/image/background.png');
}

sceneGameOver.create = function() {
  var background = this.physics.add.sprite(SCREEN_WIDTH, SCREEN_HEIGHT, 'background');
  background.setScale(SCREEN_WIDTH, SCREEN_HEIGHT);
  this.add.text(140, 20, 'Game Over', { fontSize: '38px', fill: '#000', fontStyle: 'bold' });
  this.add.text(160, 100, 'High Scores', { fontSize: '24px', fill: '#000', fontStyle: 'bold' });
  this.add.text(60, 420, 'Refresh page to try again', { fontSize: '24px', fill: '#000', fontStyle: 'bold' });

  var scene = this;
  var player = prompt("Please enter your initials for high score", "AAA");
  if(player == null) player = "AAA";
  player = player.substring(0, 3);

  if(!DEBUG) {
    this.postHighScore(player);
  }
}

sceneGameOver.postHighScore = function(initials) {
  var scene = this;
  $.post("/game/highscore", { name: initials, score: score })
    .done(function(data) {
      highScores = data;
      var highScoreStyle = { fontSize: '18px', fill: '#000' , fontStyle: 'bold' };
      highScores.forEach(function(highScore, index) {
        scene.add.text(170, 150 + (20 * index), highScore.name.toUpperCase(), highScoreStyle);
        scene.add.text(260, 150 + (20 * index), highScore.score, highScoreStyle);
      });
    });
}

sceneGameOver.inputFocus =  function(sprite) {
  sprite.canvasInput.focus();
}

sceneGameOver.update = function(time, delta) {

}

var config = {
	type: Phaser.AUTO,
	width: SCREEN_WIDTH,
	height: SCREEN_HEIGHT,
	parent: 'game',
	physics: {
		default: 'arcade',
		arcade: {
			debug: false
		}
	},
	scene: [scenePlaying, sceneGameOver]
};

var game = new Phaser.Game(config);

var map;
var floorLayer;
var walls;

var player;
var playerSword;
var family;
var enemies;
var score = 0;
var scoreText;

var cursors;

function strikeEnemy(sword, enemy) {
	var dead = enemy.getData('dead');

	if(!dead) {
		increaseScore();
		enemy.setData('dead', true);
	}
}

function increaseScore() {
	score += 15;
	scoreText.setText('Blood Spilled: ' + score);
}

function playerSwordSwingComplete(animation, frame) {
	player.swingingSword = false;
	playerSword.setPosition(-100, -100);
}