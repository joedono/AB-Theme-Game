var myGame = new Kiwi.Game();

var myState = new Kiwi.State("myState");

myState.preload = function() {
	Kiwi.State.prototype.preload.call(this);

	this.addSpriteSheet('characterSprite', 'images/game/image/character.png', 150, 117);
	this.addImage('background', 'images/game/image/jungle.png');
}

myState.create = function() {
	
}
