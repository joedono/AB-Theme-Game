(function() {
    var game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.AUTO, "game");

    game.state.add("Game", Game);
    game.state.start("Game");
})();