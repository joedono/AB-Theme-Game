var config = {
	type: Phaser.AUTO,
	width: SCREEN_WIDTH,
	height: SCREEN_HEIGHT,
	physics: {
		default: 'arcade',
		arcade: {
			debug: false
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);

var map;
var floorLayer;
var walls;

var player;
var playerSword;
var family;
var enemies;

var cursors;

function preload() {
	this.load.tilemapTiledJSON('map', 'asset/config/map.json');
	this.load.spritesheet('floor', 'asset/image/floor.png', { frameWidth: 8, frameHeight: 8 });
	this.load.image('wall', 'asset/image/wall.png');

	this.load.spritesheet('player', 'asset/image/player.png', { frameWidth: 16, frameHeight: 16 });
	this.load.spritesheet('enemy', 'asset/image/enemy.png', { frameWidth: 16, frameHeight: 16 });
	this.load.spritesheet('family', 'asset/image/family.png', { frameWidth: 16, frameHeight: 16 });
}

function create() {
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

	map = this.make.tilemap({ key: 'map' });
	var floorTiles = map.addTilesetImage('Floor', 'floor');
	floorLayer = map.createStaticLayer('Floor', floorTiles, 0, 0);

	buildWalls(this);

	player = new Player(this);
	family = this.physics.add.sprite(240, 240, 'family');
	family.anims.play('familyCalm', true);
	enemies = new Enemies(this);

	this.physics.add.collider(player.sprite, walls);
}

function buildWalls(game) {
	var mapWalls = map.getObjectLayer('Walls')['objects'];
	walls = game.physics.add.staticGroup();
	mapWalls.forEach(function(mapWall) {
		var wall = walls.create(mapWall.x, mapWall.y, 'wall');
		wall.setScale(mapWall.width / 8, mapWall.height / 8);
		wall.setOrigin(0);
		wall.body.width = mapWall.width;
		wall.body.height = mapWall.height;
	});

	walls.refresh();
}

function update(time, delta) {
	player.update();
	enemies.update(delta);
	updateFamily();
}

function updateFamily() {
	var animation = 'familyCalm';
	if(enemies.closingIn(family.x, family.y, FAMILY_PANIC_DISTANCE)) {
		animation = 'familyScared';
	}

	family.anims.play(animation, true);
}

function strikeEnemy(enemy, sword) {
	enemy.setData('health', enemy.getData('health') - 1);

	// TODO Stop enemy temporarily
}

function increaseScore() {
	// TODO Increase Score
}

function loseGame() {
	// TODO Lose Game
}