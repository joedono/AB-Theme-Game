Enemy = function(game, x, y, type) {
    this.game = game;

    this.sprite = game.add.sprite(x, y, "enemy_" + type);
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    switch(type) {
        case 1:
            this.sprite.body.velocity.y = 100;
            break;
    }
}