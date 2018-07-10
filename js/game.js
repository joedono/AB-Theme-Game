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

function preload() {
  this.load.tilemapTiledJSON('map', 'asset/config/map.json');
  this.load.spritesheet('tiles', 'asset/image/floor.png', { frameWidth: 8, frameHeight: 8 });
}

function create() {
  map = this.make.tilemap({ key: 'map' });
  var floorTiles = map.addTilesetImage('tiles');

  floorLayer = map.createDynamicLayer('Floor', floorTiles, 0, 0);
}

function update() {

}