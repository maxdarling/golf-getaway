// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 450,
    parent: 'game',
    backgroundColor: '#228B22', // green
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Game variables
let ball;
let cursors;
let ballSpeed = 200;
let ballAccel = { x: 0, y: 0 };
let debugText;

// Preload function - loads game assets
function preload() {
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
    ball = this.add.sprite(300, 225, 'golf_ball');

    // Play the golf ball animation
    ball.play('golf_ball');

    // Create cursor keys
    cursors = this.input.keyboard.createCursorKeys();

    // Add title text
    this.add.text(300, 50, 'Use arrow keys to move the ball', {
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

// Update function - runs every frame
function update(time, delta) {
    // Ball movement controls - top-down style (using delta time for smooth movement)
    if (cursors.left.isDown) {
        ballAccel.x -= ballSpeed * (delta / 100)
    }
    if (cursors.right.isDown) {
        ballAccel.x += ballSpeed * (delta / 100)
    }
    if (cursors.up.isDown) {
        ballAccel.y -= ballSpeed * (delta / 100)
    }
    if (cursors.down.isDown) {
        ballAccel.y += ballSpeed * (delta / 100)
    }

    ball.x += ballAccel.x * (delta / 10000); // Move left
    ball.y += ballAccel.y * (delta / 10000); // Move up
    BALL_FRICTION = 0.9995;
    ballAccel.x *= BALL_FRICTION;
    ballAccel.y *= BALL_FRICTION;

    // Round positions to avoid sub-pixel rendering (prevents blurriness)
    ball.x = Math.round(ball.x);
    ball.y = Math.round(ball.y);

    ballAccel.x = Phaser.Math.Clamp(ballAccel.x, -10000, 10000);
    ballAccel.y = Phaser.Math.Clamp(ballAccel.y, -10000, 10000);
    // Keep ball within screen bounds
    ballTemp = { x: ball.x, y: ball.y };
    ball.x = Phaser.Math.Clamp(ball.x, 16, 584);
    ball.y = Phaser.Math.Clamp(ball.y, 16, 434);
    if (ballTemp.x != ball.x) { ballAccel.x = -ballAccel.x; }
    if (ballTemp.y != ball.y) { ballAccel.y = -ballAccel.y; }

    // debug
    debugText.setText(`[x: ${Math.round(ballAccel.x)}, y: ${Math.round(ballAccel.y)}]`);
}

// Start the game
const game = new Phaser.Game(config);
