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
var enemies;
var paths;

var cursors;

function preload() {
  this.load.tilemapTiledJSON('map', 'asset/config/map.json');
  this.load.spritesheet('floor', 'asset/image/floor.png', { frameWidth: 8, frameHeight: 8 });
  this.load.image('wall', 'asset/image/wall.png');

  this.load.spritesheet('player', 'asset/image/player.png', { frameWidth: 16, frameHeight: 16 });
  this.load.spritesheet('enemy', 'asset/image/enemy.png', { frameWidth: 16, frameHeight: 16 });
}

function create() {
  cursors = this.input.keyboard.createCursorKeys();

  map = this.make.tilemap({ key: 'map' });
  var floorTiles = map.addTilesetImage('Floor', 'floor');
  floorLayer = map.createStaticLayer('Floor', floorTiles, 0, 0);

  buildWalls(this);
  buildPaths(this);

  player = new Player(this);
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

function buildPaths(game) {
  paths = new Array();

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
}

function update() {
  player.update();
  enemies.update();
}