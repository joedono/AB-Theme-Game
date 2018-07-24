var sceneGameOver = new Phaser.Scene('GameOver');

sceneGameOver.preload = function() {
  this.load.image('background', 'asset/image/gameOverBackground.png');
}

sceneGameOver.create = function() {
  this.physics.add.sprite(240, 240, 'background');
  this.add.text(140, 20, 'Game Over', { fontSize: '38px', fill: '#000', fontStyle: 'bold' });
  this.add.text(160, 70, 'High Scores', { fontSize: '24px', fill: '#000', fontStyle: 'bold' });
}

sceneGameOver.update = function(time, delta) {

}