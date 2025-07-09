// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 450,
    parent: 'game',
    backgroundColor: '#228B22', // Green background
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

// Preload function - loads game assets
function preload() {
    // // Create a simple white ball
    // this.make.graphics()
    //     .fillStyle(0xffffff)
    //     .fillCircle(16, 16, 16)
    //     .generateTexture('ball', 32, 32);

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
}

// Update function - runs every frame
function update(time, delta) {
    // Ball movement controls - top-down style (using delta time for smooth movement)
    if (cursors.left.isDown) {
        ball.x -= ballSpeed * (delta / 1000); // Move left
    }
    if (cursors.right.isDown) {
        ball.x += ballSpeed * (delta / 1000); // Move right
    }
    if (cursors.up.isDown) {
        ball.y -= ballSpeed * (delta / 1000); // Move up
    }
    if (cursors.down.isDown) {
        ball.y += ballSpeed * (delta / 1000); // Move down
    }

    // Round positions to avoid sub-pixel rendering (prevents blurriness)
    ball.x = Math.round(ball.x);
    ball.y = Math.round(ball.y);

    // Keep ball within screen bounds
    ball.x = Phaser.Math.Clamp(ball.x, 16, 584);
    ball.y = Phaser.Math.Clamp(ball.y, 16, 434);
}

// Start the game
const game = new Phaser.Game(config);