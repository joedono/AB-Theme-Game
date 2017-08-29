Game = function(game) {
    this.bulletTimer = 0;
    this.asteroidTimer = 0;
};

Game.prototype = {
    preload: function() {
        this.game.load.image("background", ASSET_ROOT + "/asset/img/background.png");
        this.game.load.image("player", ASSET_ROOT + "/asset/img/player.png");
        this.game.load.image("player-eye", ASSET_ROOT + "/asset/img/player-eye.png");
        this.game.load.image("bullet", ASSET_ROOT + "/asset/img/bullet.png");
        this.game.load.image("asteroid", ASSET_ROOT + "/asset/img/asteroid.png");
    },

    create: function() {
        this.game.stage.backgroundColor = "#000";
        this.game.world.setBounds(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        cursors = this.game.input.keyboard.createCursorKeys();
        fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);

        this.backgrounds = [
            this.game.add.sprite(0, 0, "background"),
            this.game.add.sprite(0, -SCREEN_HEIGHT, "background")
        ];

        for(var i in this.backgrounds) {
            this.game.physics.enable(this.backgrounds[i], Phaser.Physics.ARCADE);
            this.backgrounds[i].body.velocity.y = BACKGROUND_SPEED;
        }

        player = new Player(this.game, PLAYER_START_X, PLAYER_START_Y);
        bullets = this.game.add.group();
        asteroids = this.game.add.group();
    },

    update: function() {
        this.updateBackground();
        player.update();
        this.updateBullets();
        this.updateAsteroids();
        this.game.physics.arcade.overlap(player.sprite, asteroids, this.playerAsteroidHit, null, this);
    },

    updateBackground: function() {
        // If the background has passed out of the screen, move it back to the top
        for(var i in this.backgrounds) {
            if(this.backgrounds[i].body.y > SCREEN_HEIGHT) {
                this.backgrounds[i].body.y -= SCREEN_HEIGHT * 2;
            }
        }
    },

    updateBullets: function() {
        if(this.bulletTimer > 0) {
            this.bulletTimer -= this.game.time.physicsElapsedMS;
        }

        // Fire bullets
        if(fireKey.isDown && this.bulletTimer <= 0) {
            this.bulletTimer = PLAYER_BULLET_TIMER;

            var bullet = bullets.create(player.sprite.body.x + player.sprite.body.width / 2 - BULLET_SIZE / 2, player.sprite.body.y, "bullet");
            this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
            bullet.outOfCameraBoundsKill = true;
            bullet.autoCull = true;
            bullet.body.velocity.y = -BULLET_SPEED;
        }

        // Remove bullets that have left the screen
        var bulletCleanup = [];
        bullets.forEachDead(function(bullet){
            bulletCleanup.push(bullet);
        });

        var i = bulletCleanup.length - 1;
        while(i > -1) {
            bulletCleanup[i].destroy();
            i--;
        }
    },

    updateAsteroids: function() {
        if(this.asteroidTimer > 0) {
            this.asteroidTimer -= this.game.time.physicsElapsedMS;
        }

        if(this.asteroidTimer <= 0) {
            this.spawnAsteroid();
            this.asteroidTimer = ASTEROID_TIMER;
        }

        var asteroidCleanup = [];
        asteroids.forEachDead(function(asteroid){
            asteroidCleanup.push(asteroid);
        });

        var i = asteroidCleanup.length - 1;
        while(i > -1) {
            asteroidCleanup[i].destroy();
            i--;
        }
    },

    spawnAsteroid: function() {
        var asteroid = asteroids.create(Math.random() * SCREEN_WIDTH, 0, "asteroid");
        this.game.physics.enable(asteroid, Phaser.Physics.ARCADE);
        asteroid.outOfCameraBoundsKill = true;
        asteroid.autoCull = true;
        asteroid.body.velocity.y = ASTEROID_SPEED;

        var scale = 1 + Math.random() * 5;
        asteroid.scale = new Phaser.Point(scale, scale);
    },

    playerAsteroidHit: function(player, asteroid) {
        asteroid.kill();
        player.parentObj.hit();
    }
}