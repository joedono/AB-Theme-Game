var express = require("express");

var game = express();
game.use(express.static(process.argv[2]));
game.listen(8080);