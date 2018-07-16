Player = function(game) {
  this.game = game;

  this.sprite = game.physics.add.sprite(250, 275, 'player');
  this.sprite.setCollideWorldBounds(true);

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
};

Player.prototype = {
  update: function() {
    this.move();
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
  }
};