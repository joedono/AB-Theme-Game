Player = function(game, x, y) {
    this.game = game;

    this.sprite = game.add.sprite(x, y, "player");
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    this.eyes = game.add.group();
    this.eyes.create(22, 8, "player-eye");
    this.eyes.create(34, 8, "player-eye");

    this.eyes.x = x;
    this.eyes.y = y;
}

Player.prototype = {
    update: function() {
        this.moveEyes();

        this.eyeTimer--;
        if(this.eyeTimer <= 0) {
            this.eyeTimer = 60;
            this.eyes.visible = !this.eyes.visible;
        }
    },

    moveEyes: function() {
        this.eyes.x = this.sprite.body.x;
        this.eyes.y = this.sprite.body.y;
    }
}