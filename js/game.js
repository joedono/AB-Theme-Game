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

var cursors;

function preload() {
  this.load.tilemapTiledJSON('map', 'asset/config/map.json');
  this.load.spritesheet('floor', 'asset/image/floor.png', { frameWidth: 8, frameHeight: 8 });
  this.load.image('wall', 'asset/image/wall.png');

  this.load.image('player', 'asset/image/player.png');
}

function create() {
  map = this.make.tilemap({ key: 'map' });
  var floorTiles = map.addTilesetImage('Floor', 'floor');
  floorLayer = map.createStaticLayer('Floor', floorTiles, 0, 0);

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

  player = new Player(this);

  cursors = this.input.keyboard.createCursorKeys();
  this.physics.add.collider(player.sprite, walls);
}

function update() {
  player.update();
}