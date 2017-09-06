Game = function(game) {
    this.bulletTimer = 0;
    this.asteroidTimer = 0;
    this.asteroidCounter = 0;
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
        this.game.load.image("health-off", ASSET_ROOT + "/asset/img/healthbar-off.png");
        this.game.load.image("health-on", ASSET_ROOT + "/asset/img/healthbar-on.png");
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
        difficultyText = this.game.add.text(16, 32, "Difficulty: 1", { fontSize: '16px', fill: '#FFF' });
        healthDisplay = [];
        for(var i = 0; i < PLAYER_MAX_HEALTH; i++) {
            var healthItem = this.game.add.sprite(180 + 80 * i, 16, "health-off");
            healthDisplay.push(healthItem);
        }

        healthDisplay[0].loadTexture("health-on");
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
        if(fireKey.isDown && this.bulletTimer <= 0 && player.sprite.health > 0) {
            this.bulletTimer = PLAYER_BULLET_TIMER;

            // Straight
            var bullet = bullets.create(player.sprite.body.x + player.sprite.body.width / 2 - BULLET_SIZE / 2, player.sprite.body.y, "bullet");
            this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
            bullet.outOfCameraBoundsKill = true;
            bullet.autoCull = true;
            bullet.body.velocity.y = -BULLET_SPEED;

            switch(player.sprite.health) {
                case 4:
                    this.spawnBullet(-BULLET_SPREAD * 3);
                    this.spawnBullet(BULLET_SPREAD * 3);
                case 3:
                    this.spawnBullet(-BULLET_SPREAD * 2);
                    this.spawnBullet(BULLET_SPREAD * 2);
                case 2:
                    this.spawnBullet(-BULLET_SPREAD);
                    this.spawnBullet(BULLET_SPREAD);
                    break;
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

    spawnBullet: function(spread) {
        var bullet = bullets.create(player.sprite.body.x + player.sprite.body.width / 2 - BULLET_SIZE / 2, player.sprite.body.y, "bullet");
        this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
        bullet.outOfCameraBoundsKill = true;
        bullet.autoCull = true;
        bullet.body.velocity.y = -BULLET_SPEED;
        bullet.body.velocity.x = spread;
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
        difficultyText.text = "Difficulty: " + (this.difficulty + 1);
    },

    spawnAsteroid: function() {
        var x = Math.random() * (SCREEN_WIDTH - 60) + 30;
        var asteroid = asteroids.create(x, 0, "asteroid");
        this.game.physics.enable(asteroid, Phaser.Physics.ARCADE);

        asteroid.outOfCameraBoundsKill = true;
        asteroid.autoCull = true;

        // Aim every 5th asteroid directly at the player
        if(this.asteroidCounter % 5 == 0) {
            var sx = asteroid.body.x + asteroid.body.width / 2;
            var sy = asteroid.body.y + asteroid.body.width / 2;
            var dx = player.sprite.body.x + player.sprite.body.width / 2;
            var dy = player.sprite.body.y + player.sprite.body.height / 2;

            var vec = new Phaser.Point(dx - sx, dy - sy);
            vec = vec.normalize().multiply(ASTEROID_SPEED[this.difficulty], ASTEROID_SPEED[this.difficulty]);
            asteroid.body.velocity.x = vec.x;
            asteroid.body.velocity.y = vec.y;
        } else {
            asteroid.body.velocity.x = (Math.random() * ASTEROID_SPREAD * 2) - ASTEROID_SPREAD;
            asteroid.body.velocity.y = ASTEROID_SPEED[this.difficulty];
        }

        asteroid.setHealth(ASTEROID_HEALTH[0]);

        if(this.difficulty >= 2 && this.asteroidCounter % 4 == 0) {
            asteroid.setHealth(ASTEROID_HEALTH[1]);
            asteroid.scale.setTo(2, 2);
        }

        if(this.difficulty >= 4 && this.asteroidCounter % 7 == 0) {
            asteroid.setHealth(ASTEROID_HEALTH[2]);
            asteroid.scale.setTo(3, 3);
        }

        asteroid.anchor.setTo(0.5, 0.5);
        asteroid.body.angularVelocity = Math.random() * 1000 - 500;

        this.asteroidCounter++;
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
        this.updateHealth();
    },

    bulletAsteroidHit: function(bullet, asteroid) {
        bullet.kill();
        asteroid.damage(ASTEROID_DAMAGE);
        asteroid.alpha = 0.2;

        this.score += 10;
    },

    playerPowerUpHit: function(player, powerUp) {
        player.heal(1);
        powerUp.kill();
        this.score += 100;
        this.updateHealth();
    },

    updateHealth: function() {
        for(var i = 1; i <= PLAYER_MAX_HEALTH; i++) {
            if(i <= player.sprite.health) {
                healthDisplay[i-1].loadTexture("health-on");
            } else {
                healthDisplay[i-1].loadTexture("health-off");
            }
        }
    }
}