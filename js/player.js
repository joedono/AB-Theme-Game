Player = function(game) {
	this.game = game;

	this.sprite = game.physics.add.sprite(250, 275, 'player');
	this.sprite.setCollideWorldBounds(true);
	this.sprite.setDepth(3);

	game.anims.create({
		key: 'playerRight',
		frames: [{ key: 'player', frame: 0 }],
		frameRate: 20
	});

	game.anims.create({
		key: 'playerUp',
		frames: [{ key: 'player', frame: 1 }],
		frameRate: 20
	});

	game.anims.create({
		key: 'playerLeft',
		frames: [{ key: 'player', frame: 2 }],
		frameRate: 20
	});

	game.anims.create({
		key: 'playerDown',
		frames: [{ key: 'player', frame: 3 }],
		frameRate: 20
	});

	this.swingingSword = false;
	this.swordSwingKey = game.input.keyboard.addKey(PLAYER_SWING_SWORD_KEY);
};

Player.prototype = {
	update: function() {
		this.move();

		if(this.swingingSword) {
			this.moveSword();
		} else if(Phaser.Input.Keyboard.JustDown(this.swordSwingKey)) {
			this.swingSword();
		}
	},

	move: function() {
		var px = 0;
		var py = 0;

		if(cursors.left.isDown) px -= 1;
		if(cursors.right.isDown) px += 1;
		if(cursors.up.isDown) py -= 1;
		if(cursors.down.isDown) py += 1;

		if(px < 0) this.sprite.anims.play('playerLeft', true);
		if(px > 0) this.sprite.anims.play('playerRight', true);
		if(py < 0) this.sprite.anims.play('playerUp', true);
		if(py > 0) this.sprite.anims.play('playerDown', true);

		var pv = new Phaser.Math.Vector2(px, py);
		pv.normalize();
		pv.scale(PLAYER_SPEED);

		this.sprite.body.setVelocityX(pv.x);
		this.sprite.body.setVelocityY(pv.y);
	},

	swingSword: function() {
		this.swingingSword = true;
		this.moveSword();
		playerSword.play('swordStrike', true, 0);
	},

	moveSword: function() {
		var coordinates = this.getSwordCoordinates();
		var x = this.sprite.x + coordinates.x;
		var y = this.sprite.y + coordinates.y;
		var angle = coordinates.angle();

		playerSword.setPosition(x, y);
		playerSword.setRotation(angle);
	},

	getSwordCoordinates: function() {
		var coordinates = new Phaser.Math.Vector2();
		var facing = this.sprite.anims.getCurrentKey();
		var velocity = this.sprite.body.velocity.clone();
		var x = 0;
		var y = 0;

		if(velocity.length == 0) { // Player standing still
			switch(facing) {
				case 'playerLeft':
					x -= 1;
					break;
				case 'playerRight':
					x += 1;
					break;
				case 'playerUp':
					y -= 1;
					break;
				case 'playerDown':
					y += 1;
					break;
			}

			coordinates.x = x;
			coordinates.y = y;
		} else {
			coordinates.x = velocity.x;
			coordinates.y = velocity.y;
		}

		coordinates.normalize();
		coordinates.scale(PLAYER_SWORD_LENGTH);
		return coordinates;
	}
};