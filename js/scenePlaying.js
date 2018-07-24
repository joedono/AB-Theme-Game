var scenePlaying = new Phaser.Scene('Playing');

var map;
var floorLayer;
var walls;

var player;
var playerSword;
var family;
var enemies;

var cursors;

scenePlaying.preload = function() {
	this.load.tilemapTiledJSON('map', 'asset/config/map.json');
	this.load.spritesheet('floor', 'asset/image/floor.png', { frameWidth: 8, frameHeight: 8 });
	this.load.image('wall', 'asset/image/wall.png');

	this.load.spritesheet('player', 'asset/image/player.png', { frameWidth: 16, frameHeight: 16 });
	this.load.spritesheet('enemy', 'asset/image/enemy.png', { frameWidth: 16, frameHeight: 16 });
	this.load.spritesheet('family', 'asset/image/family.png', { frameWidth: 16, frameHeight: 16 });
}

scenePlaying.create = function() {
	cursors = this.input.keyboard.createCursorKeys();

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

	map = this.make.tilemap({ key: 'map' });
	var floorTiles = map.addTilesetImage('Floor', 'floor');
	floorLayer = map.createStaticLayer('Floor', floorTiles, 0, 0);

	this.buildWalls();

	player = new Player(this);
	family = this.physics.add.sprite(240, 240, 'family');
	family.anims.play('familyCalm', true);
	enemies = new Enemies(this);

	this.physics.add.collider(player.sprite, walls);
}

scenePlaying.buildWalls = function() {
	var mapWalls = map.getObjectLayer('Walls')['objects'];
	walls = this.physics.add.staticGroup();
	mapWalls.forEach(function(mapWall) {
		var wall = walls.create(mapWall.x, mapWall.y, 'wall');
		wall.setScale(mapWall.width / 8, mapWall.height / 8);
		wall.setOrigin(0);
		wall.body.width = mapWall.width;
		wall.body.height = mapWall.height;
	});

	walls.refresh();
}

scenePlaying.update = function(time, delta) {
	player.update();
	enemies.update(delta);
	this.updateFamily();
}

scenePlaying.updateFamily = function() {
	var animation = 'familyCalm';
	if(enemies.closingIn(family.x, family.y, FAMILY_PANIC_DISTANCE)) {
		animation = 'familyScared';
	}

	family.anims.play(animation, true);
}

scenePlaying.strikeEnemy = function(enemy, sword) {
	enemy.setData('health', enemy.getData('health') - 1);

	// TODO Stop enemy temporarily
}

scenePlaying.increaseScore = function() {
	// TODO Increase Score
}

scenePlaying.loseGame = function() {
	// TODO Lose Game
	family.anims.play('familyDead', true);
  this.scene.start('GameOver');
}