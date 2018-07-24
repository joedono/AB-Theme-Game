var sceneGameOver = new Phaser.Scene('GameOver');

var highScores = new Array();
var highScoreInput;

sceneGameOver.preload = function() {
  this.load.image('background', 'asset/image/gameOverBackground.png');
}

sceneGameOver.create = function() {
  this.physics.add.sprite(240, 240, 'background');
  this.add.text(140, 20, 'Game Over', { fontSize: '38px', fill: '#000', fontStyle: 'bold' });
  this.add.text(160, 120, 'High Scores', { fontSize: '24px', fill: '#000', fontStyle: 'bold' });

  this.getHighScores();
  this.createHighScoreInput();
}

sceneGameOver.getHighScores = function() {
  highScores.push({ name: 'asd', score: 1000 });
  highScores.push({ name: 'qwe', score: 900 });
  highScores.push({ name: 'zxc', score: 800 });
  highScores.push({ name: 'sdf', score: 700 });
  highScores.push({ name: 'dfg', score: 600 });
  highScores.push({ name: 'ert', score: 500 });
  highScores.push({ name: 'rty', score: 400 });
  highScores.push({ name: 'vbn', score: 300 });
  highScores.push({ name: 'ytr', score: 200 });
  highScores.push({ name: 'fgh', score: 100 });

  var scene = this;
  var highScoreStyle = { fontSize: '18px', fill: '#000' , fontStyle: 'bold' };
  highScores.forEach(function(highScore, index) {
    scene.add.text(170, 160 + (20 * index), highScore.name.toUpperCase(), highScoreStyle);
    scene.add.text(260, 160 + (20 * index), highScore.score, highScoreStyle);
  });
}

sceneGameOver.createHighScoreInput = function() {
  var bmd = this.add.bitmapData(400, 50);
  this.highScoreInput = this.add.sprite(10, 10, bmd);

  var parentDiv = document.getElementById('game');
  var gameCanvas = parentDiv.children[0];
  this.highScoreInput.canvasInput = new CanvasInput({
    canvas: gameCanvas,
    fontSize: 12,
    fontFamily: 'Courier',
    fontColor: '#000',
    width: 300,
    x: 10,
    y: 10
  });

  this.highScoreInput.inputEnabled = true;
  this.highScoreInput.input.useHandCursor = true;
  this.highScoreInput.events.onInputUp.add(this.inputFocus, this);
}

sceneGameOver.inputFocus =  function(sprite) {
  sprite.canvasInput.focus();
}

sceneGameOver.update = function(time, delta) {

}