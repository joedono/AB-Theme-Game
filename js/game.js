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

var player;

function preload() {
  this.load.tilemapTiledJSON('map', 'asset/config/map.json');
  this.load.spritesheet('floor', 'asset/image/floor.png', { frameWidth: 8, frameHeight: 8 });

  this.load.image('player', 'asset/image/player.png');
}

function create() {
  map = this.make.tilemap({ key: 'map' });
  var floorTiles = map.addTilesetImage('Floor', 'floor');

  floorLayer = map.createStaticLayer('Floor', floorTiles, 0, 0);

  player = this.physics.add.sprite(200, 200, 'player');
}

function update() {

}