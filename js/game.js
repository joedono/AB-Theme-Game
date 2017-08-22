Game = function(game) {};
Game.prototype = {
    preload: function() {
        this.game.load.image("background", ASSET_ROOT + "/asset/img/background.png");
        this.game.load.image("player", ASSET_ROOT + "/asset/img/player.png");
        this.game.load.image("player-eye", ASSET_ROOT + "/asset/img/player-eye.png");
    },

    create: function() {
        this.game.stage.backgroundColor = "#000";
        this.game.world.setBounds(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        cursors = this.game.input.keyboard.createCursorKeys();

        this.backgrounds = [
            this.game.add.sprite(0, 0, "background"),
            this.game.add.sprite(0, -SCREEN_HEIGHT, "background")
        ];

        for(var i in this.backgrounds) {
            this.game.physics.enable(this.backgrounds[i], Phaser.Physics.ARCADE);
            this.backgrounds[i].body.velocity.y = BACKGROUND_SPEED;
        }

        player = new Player(this.game, PLAYER_START_X, PLAYER_START_Y);
    },

    update: function() {
        this.updateBackground();
        player.update();
    },

    updateBackground: function() {
        // If the background has passed out of the screen, move it back to the top
        for(var i in this.backgrounds) {
            if(this.backgrounds[i].body.y > SCREEN_HEIGHT) {
                this.backgrounds[i].body.y -= SCREEN_HEIGHT * 2;
            }
        }
    }
}