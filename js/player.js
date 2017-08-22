Player = function(game, x, y) {
    this.game = game;

    this.sprite = game.add.sprite(x, y, "player");
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
}

Player.prototype = {
    update: function() {

    }
}