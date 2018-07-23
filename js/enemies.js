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

  this.enemies = game.physics.add.group();

  this.buildPaths();
  game.physics.add.collider(this.enemies, walls);
  game.physics.add.collider(this.enemies, playerSword, strikeEnemy, null, game);

  this.spawnTimer = ENEMY_SPAWN_TIMER;
};

Enemies.prototype = {
  update: function(delta) {
    delta = delta / 1000;
    this.updateSpawnTimer(delta);
    this.updateEnemies(delta);
    this.cleanupEnemies();
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
      this.spawnTimer = ENEMY_SPAWN_TIMER;
    }
  },

  spawnEnemy: function() {
    var path = this.paths[RANDOM];
    var startPointX = path.x[0];
    var startPointY = path.y[0];

    var enemy = this.enemies.add(startPointX, startPointY, 'enemy');
    enemy.setData('health', ENEMY_HEALTH);
    enemy.setData('path', path);
    enemy.setData('timer', 0);
  },

  updateEnemies: function(delta) {
    this.enemies.children.iterate(function(enemy) {
      var timer = enemy.getData('timer');
      timer += delta;
      var progress = timer / ENEMY_PATH_TIMER;

      // TODO Move along path
    });
  },

  cleanupEnemies: function() {
    this.enemies.children.iterate(function(enemy) {
      if(enemy.getData('health') <= 0) {
        enemy.destroy();
      }
    });
  }
};