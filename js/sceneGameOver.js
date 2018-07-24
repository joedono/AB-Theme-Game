var sceneGameOver = new Phaser.Scene('GameOver');

var highScores = new Array();

sceneGameOver.preload = function() {
  this.load.image('background', 'asset/image/background.png');
}

sceneGameOver.create = function() {
  this.physics.add.sprite(240, 240, 'background');
  this.add.text(140, 20, 'Game Over', { fontSize: '38px', fill: '#000', fontStyle: 'bold' });
  this.add.text(160, 100, 'High Scores', { fontSize: '24px', fill: '#000', fontStyle: 'bold' });
  this.add.text(60, 420, 'Refresh page to try again', { fontSize: '24px', fill: '#000', fontStyle: 'bold' });

  var scene = this;
  var player = prompt("Please enter your initials for high score", "AAA");
  if(player == null) player = "AAA";
  player = player.substring(0, 3);

  this.getHighScores(player);
}

sceneGameOver.getHighScores = function(initials) {
  var scene = this;
  $.get("/highscores.json", { name: initials, score: score })
    .done(function(data) {
      highScores = data;
      var highScoreStyle = { fontSize: '18px', fill: '#000' , fontStyle: 'bold' };
      highScores.forEach(function(highScore, index) {
        scene.add.text(170, 150 + (20 * index), highScore.name.toUpperCase(), highScoreStyle);
        scene.add.text(260, 150 + (20 * index), highScore.score, highScoreStyle);
      });
    });
}

sceneGameOver.inputFocus =  function(sprite) {
  sprite.canvasInput.focus();
}

sceneGameOver.update = function(time, delta) {

}