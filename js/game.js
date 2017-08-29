Game = function(game) {
    this.bulletTimer = 0;
    this.asteroidTimer = 0;
    this.score = 0;
    this.difficulty = 0;
    this.powerupSpawnTimer = Math.random() * POWERUP_SPAWN_RANGE + POWERUP_SPAWN_MIN;
};

Game.prototype = {
    preload: function() {
        this.game.load.image("background", ASSET_ROOT + "/asset/img/background.png");
        this.game.load.image("player", ASSET_ROOT + "/asset/img/player.png");
        this.game.load.image("player-eye", ASSET_ROOT + "/asset/img/player-eye.png");
        this.game.load.image("bullet", ASSET_ROOT + "/asset/img/bullet.png");
        this.game.load.image("asteroid", ASSET_ROOT + "/asset/img/asteroid.png");
        this.game.load.image("powerup", ASSET_ROOT + "/asset/img/powerup.png");
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
        powerups = this.game.add.group();
        scoreText = this.game.add.text(16, 16, "Score: 0", { fontSize: '16px', fill: '#FFF' });
    },

    update: function() {
        this.updateBackground();
        player.update();
        this.updateBullets();
        this.updateAsteroids();
        this.updatePowerups();
        this.updateScore();

        this.game.physics.arcade.overlap(player.sprite, asteroids, this.playerAsteroidHit, null, this);
        this.game.physics.arcade.overlap(bullets, asteroids, this.bulletAsteroidHit, null, this);
        this.game.physics.arcade.overlap(player.sprite, powerups, this.playerPowerUpHit, null, this);
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

            // Straight
            var bullet = bullets.create(player.sprite.body.x + player.sprite.body.width / 2 - BULLET_SIZE / 2, player.sprite.body.y, "bullet");
            this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
            bullet.outOfCameraBoundsKill = true;
            bullet.autoCull = true;
            bullet.body.velocity.y = -BULLET_SPEED;

            if(player.powerUpTimer > 0) {
                // left
                var bullet = bullets.create(player.sprite.body.x + player.sprite.body.width / 2 - BULLET_SIZE / 2, player.sprite.body.y, "bullet");
                this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
                bullet.outOfCameraBoundsKill = true;
                bullet.autoCull = true;
                bullet.body.velocity.y = -BULLET_SPEED;
                bullet.body.velocity.x = -BULLET_SPREAD;

                // Right
                var bullet = bullets.create(player.sprite.body.x + player.sprite.body.width / 2 - BULLET_SIZE / 2, player.sprite.body.y, "bullet");
                this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
                bullet.outOfCameraBoundsKill = true;
                bullet.autoCull = true;
                bullet.body.velocity.y = -BULLET_SPEED;
                bullet.body.velocity.x = BULLET_SPREAD;
            }
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
            this.asteroidTimer = ASTEROID_TIMER[this.difficulty];
        }

        asteroids.forEach(function(asteroid) {
            if(asteroid.alpha < 1) {
                asteroid.alpha = asteroid.alpha + 0.1;
            }

            if(asteroid.alpha > 1) {
                asteroid.alpha = 1;
            }
        });

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

    updatePowerups: function() {
        if(this.powerupSpawnTimer > 0) {
            this.powerupSpawnTimer -= this.game.time.physicsElapsedMS;
        }

        if(this.powerupSpawnTimer <= 0) {
            this.spawnPowerup();
            this.powerupSpawnTimer = Math.random() * POWERUP_SPAWN_RANGE + POWERUP_SPAWN_MIN;
        }

        var powerupCleanup = [];
        powerups.forEachDead(function(powerup){
            powerupCleanup.push(powerup);
        });

        var i = powerupCleanup.length - 1;
        while(i > -1) {
            powerupCleanup[i].destroy();
            i--;
        }
    },

    updateScore: function() {
        scoreText.text = "Score: " + Math.floor(this.score);
        if(this.difficulty < ASTEROID_SPEED.length - 1) {
            this.difficulty = Math.floor(this.score / DIFFICULTY_PROGRESSION);
        }
    },

    spawnAsteroid: function() {
        var x = Math.random() * (SCREEN_WIDTH - 60) + 30;
        var asteroid = asteroids.create(x, 0, "asteroid");
        this.game.physics.enable(asteroid, Phaser.Physics.ARCADE);

        asteroid.outOfCameraBoundsKill = true;
        asteroid.autoCull = true;

        asteroid.body.velocity.y = ASTEROID_SPEED[this.difficulty];

        asteroid.setHealth(ASTEROID_HEALTH);

        asteroid.anchor.setTo(0.5, 0.5);
        asteroid.body.angularVelocity = Math.random() * 1000 - 500;
    },

    spawnPowerup: function() {
        var x = Math.random() * (SCREEN_WIDTH - 60) + 30;
        var powerup = powerups.create(x, 0, "powerup");

        this.game.physics.enable(powerup, Phaser.Physics.ARCADE);

        powerup.outOfCameraBoundsKill = true;
        powerup.autoCull = true;

        powerup.body.velocity.y = POWERUP_SPEED;
    },

    playerAsteroidHit: function(player, asteroid) {
        player.parentObj.hit();
        asteroid.kill();
    },

    bulletAsteroidHit: function(bullet, asteroid) {
        bullet.kill();
        asteroid.damage(ASTEROID_DAMAGE);
        asteroid.alpha = 0.2;

        this.score += 10;
    },

    playerPowerUpHit: function(player, powerUp) {
        player.parentObj.powerUpTimer = PLAYER_POWERUP_TIMER;
        powerUp.kill();

        this.score += 100;
    }
}