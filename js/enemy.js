Enemy = function(game, x, y, type) {
    this.game = game;

    this.sprite = game.add.sprite(x, y, "enemy");
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.collideWorldBounds = true;
}