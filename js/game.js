var config = {
	type: Phaser.AUTO,
	width: SCREEN_WIDTH,
	height: SCREEN_HEIGHT,
	physics: {
		default: 'arcade',
		arcade: {
			debug: false
		}
	},
	scene: [ scenePlaying, sceneGameOver ]
};

var game = new Phaser.Game(config);