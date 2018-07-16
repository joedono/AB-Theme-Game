Player = function(game) {
  this.game = game;

  this.sprite = game.physics.add.sprite(250, 275, 'player');
  this.sprite.setCollideWorldBounds(true);
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

    var pv = new Phaser.Math.Vector2(px, py);
    pv.normalize();
    pv.scale(PLAYER_SPEED);

    this.sprite.body.setVelocityX(pv.x);
    this.sprite.body.setVelocityY(pv.y);
  }
};