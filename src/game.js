var options = {
	debug: DEBUG,
	width: SCREEN_WIDTH,
	height: SCREEN_HEIGHT
};

var myGame = new Kiwi.Game("game", "Tutorial", null, options);

setTimeout(function() {
	myGame.states.addState(statePlaying);
	myGame.states.switchState("statePlaying");
}, 1000);
