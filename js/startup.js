(function() {
    var game = new Phaser.Game(800, 500, Phaser.AUTO, "game");

    game.state.add("Game", Game);
    game.state.start("Game");
})();