Player = function(game, x, y) {
    this.game = game;

    this.sprite = game.add.sprite(x, y, "player");
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.collideWorldBounds = true;

    this.eyes = game.add.group();
    this.eyes.create(22, 8, "player-eye");
    this.eyes.create(34, 8, "player-eye");

    this.eyes.x = x;
    this.eyes.y = y;

    this.bulletTimer = 0;
}

Player.prototype = {
    update: function() {
        this.moveSelf();
        this.moveEyes();
    },

    moveSelf: function() {
        var dx = 0;
        var dy = 0;

        if(cursors.left.isDown) {
            dx = -PLAYER_SPEED;
        } else if(cursors.right.isDown) {
            dx = PLAYER_SPEED;
        }

        if(cursors.up.isDown) {
            dy = -PLAYER_SPEED;
        } else if(cursors.down.isDown) {
            dy = PLAYER_SPEED;
        }

        this.sprite.body.velocity.x = dx;
        this.sprite.body.velocity.y = dy;
    },

    moveEyes: function() {
        this.eyes.x = this.sprite.body.x;
        this.eyes.y = this.sprite.body.y;
    }
}