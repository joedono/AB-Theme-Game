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

  this.ninjas = game.physics.add.group();

  this.buildPaths();
};

Enemies.prototype = {
  update: function() {

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
  }
};