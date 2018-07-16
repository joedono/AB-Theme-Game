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

  this.ninjas = game.physics.add.group();
};

Enemies.prototype = {
  update: function() {

  }
};