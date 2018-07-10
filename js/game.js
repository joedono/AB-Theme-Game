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

var cursors;

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
  player.setCollideWorldBounds(true);

  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  movePlayer();
}

function movePlayer() {
  var px = 0;
  var py = 0;

  if(cursors.left.isDown) {
    px -= 1;
  } else if(cursors.right.isDown) {
    px += 1;
  }

  if(cursors.up.isDown) {
    py -= 1;
  } else if(cursors.down.isDown) {
    py += 1;
  }


  var pv = new Phaser.Math.Vector2(px, py);
  pv.normalize();
  pv.scale(PLAYER_SPEED);

  player.body.setVelocityX(pv.x);
  player.body.setVelocityY(pv.y);
}