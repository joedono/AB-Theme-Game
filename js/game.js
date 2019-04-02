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
	}
};

var game = new Phaser.Game(config);
