var config = {
	type: Phaser.AUTO,
	width: SCREEN_WIDTH,
	height: SCREEN_HEIGHT,
	parent: 'game',
	physics: {
		default: 'arcade',
		arcade: {
			debug: false
		}
	},
	scene: [scenePlaying, sceneGameOver]
};

var game = new Phaser.Game(config);

var map;
var floorLayer;
var walls;

var player;
var family;
var enemies;
var score = 0;
var scoreText;

var cursors;

function strikeEnemy(sword, enemy) {
	var health = enemy.getData('health');
	health--;

	if(health <= 0) {
		increaseScore();
		enemy.destroy();
	} else {
		increaseScore();
		enemy.setData('health', health);
		// TODO Stop enemy temporarily
	}
}

function increaseScore() {
	score += 15;
	scoreText.setText('Blood Spilled: ' + score);
}