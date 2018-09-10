Enemies = function(game) {
	this.game = game;

	game.anims.create({
		key: 'enemyRight',
		frames: [{ key: 'enemy', frame: 0 }],
		frameRate: 20
	});

	game.anims.create({
		key: 'enemyUp',
		frames: [{ key: 'enemy', frame: 1 }],
		frameRate: 20
	});

	game.anims.create({
		key: 'enemyLeft',
		frames: [{ key: 'enemy', frame: 2 }],
		frameRate: 20
	});

	game.anims.create({
		key: 'enemyDown',
		frames: [{ key: 'enemy', frame: 3 }],
		frameRate: 20
	});

	game.anims.create({
		key: 'enemyInvincible',
		frames: [{ key: 'enemy', frame: 4 }],
		frameRate: 20
	})

	this.enemies = game.physics.add.group();

	this.buildPaths();
	game.physics.add.collider(this.enemies, walls);
	game.physics.add.collider(playerSword, this.enemies, strikeEnemy);

	this.spawnTimer = ENEMY_MAX_SPAWN_TIMER;

	this.spawnEnemy();
};

Enemies.prototype = {
	update: function(delta) {
		delta = delta / 1000;
		this.updateSpawnTimer(delta);
		this.updateEnemies(this.game, delta);
	},

	buildPaths: function() {
		var paths = new Array();

		var pathSources = new Array();
		pathSources.push(map.getObjectLayer('Paths Basic')['objects']);
		pathSources.push(map.getObjectLayer('Paths Simple')['objects']);
		pathSources.push(map.getObjectLayer('Paths Simple Longer')['objects']);
		pathSources.push(map.getObjectLayer('Paths Medium Vertical')['objects']);
		pathSources.push(map.getObjectLayer('Paths Medium Horizontal')['objects']);
		pathSources.push(map.getObjectLayer('Paths Complex One')['objects']);
		pathSources.push(map.getObjectLayer('Paths Complex Two')['objects']);
		pathSources.push(map.getObjectLayer('Paths Complex Three')['objects']);

		pathSources.forEach(function(pathSource) {
			pathSource.forEach(function(line) {
				var originX = line.x;
				var originY = line.y;
				var points = line.polyline;
				var pathX = new Array();
				var pathY = new Array();
				points.forEach(function(point) {
					pathX.push(originX + point.x);
					pathY.push(originY + point.y);
				});

				paths.push({
					'x': pathX,
					'y': pathY
				});
			});
		});

		this.paths = paths;
	},

	updateSpawnTimer: function(delta) {
		this.spawnTimer -= delta;
		if(this.spawnTimer <= 0) {
			this.spawnEnemy();
			this.resetSpawnTimer();
		}
	},

	spawnEnemy: function() {
		var path = this.paths[Phaser.Math.RND.between(0, this.paths.length - 1)];
		var startPointX = path.x[0];
		var startPointY = path.y[0];

		var enemy = this.enemies.create(startPointX, startPointY, 'enemy');
		enemy.setDepth(2);
		enemy.setData('health', ENEMY_HEALTH);
		enemy.setData('path', path);
		enemy.setData('timer', 0);
		enemy.setData('invincible', 0);
	},

	updateEnemies: function(game, delta) {
		var reachedFamily = false;
		var manager = this;

		this.enemies.children.iterate(function(enemy) {
			var timer = enemy.getData('timer');
			var invincible = enemy.getData('invincible');

			if(invincible > 0) {
				enemy.anims.play('enemyInvincible', true);
				invincible -= delta;
				enemy.setData('invincible', invincible);
			} else if(timer < ENEMY_PATH_TIMER) {
				var source = new Phaser.Geom.Point(enemy.x, enemy.y);
				var path = enemy.getData('path');

				timer += delta;
				var distance = timer / ENEMY_PATH_TIMER;
				var dest = new Phaser.Geom.Point(
					Phaser.Math.Interpolation.Linear(path.x, distance),
					Phaser.Math.Interpolation.Linear(path.y, distance)
				);

				var angle = Phaser.Math.Angle.BetweenPoints(source, dest);
				if(angle < 0) {
					angle += Phaser.Math.PI2;
				}

				var facingAnim = 'enemyUp';
				if(angle < Math.PI * 1/4 || angle > Math.PI * 7/4) {
					facingAnim = 'enemyRight';
				} else if(angle < Math.PI * 3/4 && angle > Math.PI * 1/4) {
					facingAnim = 'enemyDown';
				} else if(angle < Math.PI * 5/4 && angle > Math.PI * 3/4) {
					facingAnim = 'enemyLeft';
				}

				enemy.x = dest.x;
				enemy.y = dest.y;
				enemy.setData('timer', timer);
				enemy.anims.play(facingAnim, true);
			} else {
				reachedFamily = true;
			}
		});

		if(reachedFamily) {
			this.game.loseGame();
		}
	},

	resetSpawnTimer: function() {
	  if (score > ENEMY_MAX_DIFFICULTY_SCORE) {
			this.spawnTimer = ENEMY_MIN_SPAWN_TIMER;
		} else {
			var progress = score / ENEMY_MAX_DIFFICULTY_SCORE;
			var timers = [ENEMY_MAX_SPAWN_TIMER, ENEMY_MIN_SPAWN_TIMER];
			this.spawnTimer = Phaser.Math.Interpolation.Linear(timers, progress);
		}

		console.log(this.spawnTimer);
	},

	closingIn: function(x, y, dist) {
		var close = false;

		this.enemies.children.iterate(function(enemy) {
			if(Phaser.Math.Distance.Between(enemy.x, enemy.y, x, y) < dist) {
				close = true;
			}
		});

		return close;
	}
};