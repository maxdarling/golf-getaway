    // game size in pixels
    let GAMEWIDTH = 1200;
    let GAMEHEIGHT = 900;
    let BALLRADIUS  = 22;

    // Game configuration
    const config = {
        type: Phaser.AUTO,
        width: GAMEWIDTH,
        height: GAMEHEIGHT,
        parent: 'game',
        backgroundColor: '#228B22', // Green background
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    class GameObject {
        constructor() {
            this.sprite = null;
            this.speed = 300;
            this.accel = {x: 0, y: 0};
        }
    }
    class Ball extends GameObject {
        constructor() {
            super();
        }
    }
    class Hole extends GameObject {
        constructor() {
            super();
        }
    }

    let ball = new Ball();
    let hole = new Hole();

    let cursors; // for keyboard input

    // movement formula:
    // - when you hold down an arrow key, the hole gains acceleration in that direction
    // - arrow key in the opposing direction reduces that accel
    // - hole movement is calculated via: hole.x += accel.x * base_speed

    // Preload function - loads game assets
    function preload() {
        // golf hole sprite
        this.make.graphics()
            .fillStyle(0x000000)
            .fillCircle(BALLRADIUS, BALLRADIUS, BALLRADIUS)
            .generateTexture('golf_hole', BALLRADIUS * 2, BALLRADIUS * 2);

        // golf ball sprite
        this.load.atlas('golf_ball', 'assets/golf_ball.png', 'assets/golf_ball.json');
    }

    // Create function - sets up the game scene
    function create() {
        // Create the golf ball animation now that assets are loaded
        this.anims.create({
            key: 'golf_ball',
            frames: this.anims.generateFrameNames('golf_ball', {
              prefix: 'golf_ball',
              start: 0,
              end: 3,
              zeroPad: 1,
              suffix: '.png'
            }),
            frameRate: 10,
            repeat: -1
        });

        // Create the golf ball in the center
        hole.sprite = this.add.sprite(300, 225, 'golf_hole');
        ball.sprite = this.add.sprite(300, 225, 'golf_ball');

        // Play the golf ball animation
        ball.sprite.play('golf_ball');
        hole.sprite.play('golf_hole');

        // Create cursor keys
        cursors = this.input.keyboard.createCursorKeys();

        // Add title text
        this.add.text(300, 50, 'Golf Ball Game', {
            fontSize: '32px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.add.text(300, 90, 'Use arrow keys to move the ball', {
            fontSize: '18px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        debugText = this.add.text(50, 20, '', {
            fontSize: '8px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
    }

    function handleMovingObject(time, delta, gameObj, isPlayer) {
        if (isPlayer) {
            if (cursors.left.isDown) {
                gameObj.accel.x -= gameObj.speed * (delta / 100)
            }
            if (cursors.right.isDown) {
                gameObj.accel.x += gameObj.speed * (delta / 100)
            }
            if (cursors.up.isDown) {
                gameObj.accel.y -= gameObj.speed * (delta / 100)
            }
            if (cursors.down.isDown) {
                gameObj.accel.y += gameObj.speed * (delta / 100)
            }
        }

        // general ball movement update
        gameObj.sprite.x += gameObj.accel.x * (delta / 10000); // Move left
        gameObj.sprite.y += gameObj.accel.y * (delta / 10000); // Move up
        gameObj.accel.x *= 0.992;
        gameObj.accel.y *= 0.992;

        // Round positions to avoid sub-pixel rendering (prevents blurriness)
        // gameObj.sprite.x = Math.round(gameObj.sprite.x);
        // gameObj.sprite.y = Math.round(gameObj.sprite.y);

        // acceleration cap
        gameObj.accel.x = Phaser.Math.Clamp(gameObj.accel.x, -10000, 10000);
        gameObj.accel.y = Phaser.Math.Clamp(gameObj.accel.y, -10000, 10000);

        // Keep gameObj within screen bounds
        let gameObjTemp = {x: gameObj.sprite.x, y: gameObj.sprite.y};
        gameObj.sprite.x = Phaser.Math.Clamp(gameObj.sprite.x, 16, GAMEWIDTH - gameObj.sprite.width);
        gameObj.sprite.y = Phaser.Math.Clamp(gameObj.sprite.y, 16, GAMEHEIGHT - gameObj.sprite.height);
        if (gameObjTemp.x != gameObj.sprite.x) {gameObj.accel.x = -gameObj.accel.x;}
        if (gameObjTemp.y != gameObj.sprite.y) {gameObj.accel.y = -gameObj.accel.y;}
    }

    // Update function - runs every frame
    function update(time, delta) {
        handleMovingObject(time, delta, hole, isPlayer = true);
        handleMovingObject(time, delta, ball, isPlayer = false);

        // debug
        debugText.setText(`[x: ${Math.round(hole.accel.x)}, y: ${Math.round(hole.accel.y)}]`);
    }

    // Start the game
    const game = new Phaser.Game(config);