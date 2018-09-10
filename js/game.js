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
var playerSword;
var family;
var enemies;
var score = 0;
var scoreText;

var cursors;

function strikeEnemy(sword, enemy) {
	var dead = enemy.getData('dead');

	if(!dead) {
		increaseScore();
		enemy.setData('dead', true);
	}
}

function increaseScore() {
	score += 15;
	scoreText.setText('Blood Spilled: ' + score);
}

function playerSwordSwingComplete(animation, frame) {
	player.swingingSword = false;
	playerSword.setPosition(-100, -100);
}