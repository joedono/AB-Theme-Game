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