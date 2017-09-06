 var player;
 var cursors;
 var fireKey;
 var bullets;
 var asteroids;
 var powerups;
 var scoreText;
 var healthText;
 var difficultyText;

var SCREEN_HEIGHT = 700;
var SCREEN_WIDTH = 500;

var BACKGROUND_SPEED = 50;
var DIFFICULTY_PROGRESSION = 2000;

var ASSET_ROOT = "";

var PLAYER_START_X = 200;
var PLAYER_START_Y = 600;
var PLAYER_SPEED = 200;
var PLAYER_BULLET_TIMER = 100;
var PLAYER_HEALTH = 1;
var PLAYER_DAMAGE = 1;
var PLAYER_BLINK_TIMER = 500;

var BULLET_SPEED = 600;
var BULLET_SIZE = 8;
var BULLET_SPREAD = 120;

var ASTEROID_SPEED = [100, 200, 300, 400, 500];
var ASTEROID_TIMER = [1000, 700, 500, 300, 200];
var ASTEROID_HEALTH = [10, 15, 20];
var ASTEROID_DAMAGE = 1;
var ASTEROID_SPREAD = 60;

var POWERUP_SPEED = 70;
var POWERUP_SPAWN_RANGE = 15000;
var POWERUP_SPAWN_MIN = 20000;