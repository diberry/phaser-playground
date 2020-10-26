// the game itself
let game;
var gameOver = false;
var countOfCollisions = 0;
var collisionArray = [];
var gameLoopCount = 0;
var gameLoopPlayerLocations = [];

var canvasHeight = 800;
var canvasWidth = 800;

var gameText;
var paused = 0;

// global object with configuration options
let gameOptions = {

    // radius of the big circle, in pixels
    bigCircleRadius: 300,

    // thickness of the big circle, in pixels
    bigCircleThickness: 20,

    // radius of the player, in pixels
    playerRadius: 25,

    // player speed, in degrees per frame
    playerSpeed: 0.6,

    // world gravity
    worldGravity: 0.8,

    // jump force of the single and double jump
    jumpForce: [12, 8]
};

startPhaserGame = () =>{
    let gameConfig = {
        type: Phaser.CANVAS,
        backgroundColor: 0x444444,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: canvasWidth,
            height: canvasHeight
        },
        scene: playGame,
        physics: {
            default: 'arcade',
            arcade: {
                debug: true
            }
        },
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}
startGame = () => {
    console.log("startGame clicked");
    startPhaserGame();
}
pauseGame = () => {
    
    if (paused === 0) {
        console.log("pauseGame clicked - paused === 0");
        game.scene.pause("PlayGame");
        paused = 1;
        var node = document.getElementById('pauseButton');
        node.innerHTML = "Resume";
    } else {
        console.log("pauseGame clicked - paused != 0");
        game.scene.resume("PlayGame");
        paused = 0;
        var node = document.getElementById('pauseButton');
        node.innerHTML = "Pause";
    }
    
}
stopGame = () => {
    console.log("stopGame clicked");
    game.destroy(true);
}
class playGame extends Phaser.Scene {

    constructor() {
        super("PlayGame");
    }
    preload() {
        this.load.image("player", "./assets/player.png");
        this.load.image("enemy", "./assets/red.png");
    }
    createEnvironment() {
        // array to store all painted arcs
        this.paintedArcs = [];

        // calculate the distance from the center of the canvas and the big circle
        this.distanceFromCenter = gameOptions.bigCircleRadius - gameOptions.playerRadius - gameOptions.bigCircleThickness / 2;

        // draw the big circle
        this.bigCircle = this.add.graphics();
        this.bigCircle.lineStyle(gameOptions.bigCircleThickness, 0xffffff);
        this.bigCircle.strokeCircle(game.config.width / 2, game.config.height / 2, gameOptions.bigCircleRadius);

        // graphics object where to draw the highlight circle
        this.highlightCircle = this.add.graphics();
    }
    createEnemy() {
        //const enemyX = game.config.width / 2;
        //const enemyY = game.config.height / 2 - this.distanceFromCenter;

        let enemy = this.physics.add.sprite(135.3631732900355, 413.86902840433345, "enemy");
        enemy.enableBody = false;
        enemy.displayWidth = gameOptions.playerRadius * 2;
        enemy.displayHeight = gameOptions.playerRadius * 2;

        return enemy;
    }
    createPlayer() {
        // add player sprite
        let player = this.physics.add.sprite(game.config.width / 2, game.config.height / 2 - this.distanceFromCenter, "player");
        player.displayWidth = gameOptions.playerRadius * 2;
        player.displayHeight = gameOptions.playerRadius * 2;

        // player current angle, on top of the big circle
        player.currentAngle = -90;

        // player previous angle, at the moment same value of current angle
        player.previousAngle = player.currentAngle;

        // jump offset, the distance from the ground and player position during jumps
        player.jumpOffset = 0;

        // counter to keep track of player jumps
        player.jumps = 0;

        // current jump force
        player.jumpForce = 0;

        return player;

    }
    create() {


        this.createEnvironment();
        this.player = this.createPlayer();
        this.enemy = this.createEnemy();

        // input listener
        this.input.on("pointerdown", function () {
            
            console.log("mouse click");

            // if the player jumped less than 2 times...
            if (this.player.jumps < 2) {

                // one more jump
                this.player.jumps++;

                // add to player jump force the proper force according to the number of jumps performed
                this.player.jumpForce = gameOptions.jumpForce[this.player.jumps - 1];
            }
        }, this);

        // text to display player progress
        gameText = this.add.text(game.config.width / 2, game.config.height / 2, "", {
            fontFamily: "Arial",
            fontSize: 96,
            color: "#00ff00"
        });
        gameText.setOrigin(0.5);
        
        this.debugText = this.add.text(30, canvasHeight - 20, "", {
            fontFamily: "Arial",
            fontSize: 20,
            color: "#00ff00"
        });
        //this.debugText.setOrigin(10);

        this.physics.add.collider(this.player, this.enemy, this.enemyCollision);
        //this.pause();
    }

    // method to be executed at each frame
    update() {

        // if the player is jumping...
        if (this.player.jumps > 0) {

            // increase player jump offset according to jump force
            this.player.jumpOffset += this.player.jumpForce;

            // decrease jump force ti simulate gravity
            this.player.jumpForce -= gameOptions.worldGravity;

            // if jump offset is zero or less than zero, that is the player is on the ground...
            if (this.player.jumpOffset < 0) {

                // set jump offset to zero
                this.player.jumpOffset = 0;

                // player is not jumping
                this.player.jumps = 0;

                // player has no jump force
                this.player.jumpForce = 0;
            }
        }

        // update previous angle to current angle
        this.player.previousAngle = this.player.currentAngle;

        // update current angle adding player speed
        this.player.currentAngle = Phaser.Math.Angle.WrapDegrees(this.player.currentAngle + gameOptions.playerSpeed);

        // make enemy enabled
        if (gameLoopCount > 10) {
            // show enemy - collision can now happen
            this.enemy.enableBody = false;
        }
        
        // if player is not jumping...
        if (this.player.jumpOffset == 0) {

            // set painted ratio to zero
            this.paintedRatio = 0;

            // convert Phaser angles to a more readable angles where zero is on top, 90 is right, 180 down, 270 left
            let currentAngle = this.getGameAngle(this.player.currentAngle);
            let previousAngle = this.getGameAngle(this.player.previousAngle);

            // if current angle is greater than previous angle...
            if (currentAngle >= previousAngle) {

                // put in paintedArcs array a new arc
                this.paintedArcs.push([previousAngle, currentAngle]);
            }
            else {

                // this is the case player passed from a value less than 360 to a value greater than 360, which is zero
                // we manage this case as a couple of arcs
                this.paintedArcs.push([previousAngle, 360]);
                this.paintedArcs.push([0, currentAngle]);
            }

            // prepare highlightCircle graphic object to draw
            this.highlightCircle.clear();
            this.highlightCircle.lineStyle(gameOptions.bigCircleThickness, 0xff00ff);

            // merge small arcs into bigger arcs, if possible
            this.paintedArcs = this.mergeIntervals(this.paintedArcs);

            // loop through all arcs
            this.paintedArcs.forEach(function (i) {

                // increase painted ratio value with arc length
                this.paintedRatio += (i[1] - i[0]);

                // draw the arc
                this.highlightCircle.beginPath();
                this.highlightCircle.arc(game.config.width / 2, game.config.height / 2, gameOptions.bigCircleRadius, Phaser.Math.DegToRad(i[0] - 90), Phaser.Math.DegToRad(i[1] - 90), false);
                this.highlightCircle.strokePath();
            }.bind(this));

            // convert the sum of all arcs lenght into a 0 -> 100 value
            this.paintedRatio = Math.round(this.paintedRatio * 100 / 360);

            if (this.paintedRatio === 100) {
                this.printPlayerLocationArray();
                this.unloadGame();
            } else {
                gameText.setText(this.paintedRatio + "%");
            }
            this.debugText.setText(`${this.player.x},${this.player.y}`);

            // if the player painted the whole circle...
            if (this.paintedRatio == 100) {

                // ... restart the game in two seconds
                this.time.addEvent({
                    delay: 2000,
                    callbackScope: this,
                    callback: function () {
                        this.scene.start("PlayGame");
                    }
                });
            }
        }

        // transform degrees to radians
        let radians = Phaser.Math.DegToRad(this.player.currentAngle);

        // determine distance from center according to jump offset
        let distanceFromCenter = this.distanceFromCenter - this.player.jumpOffset;

        // position player using trigonometry
        this.player.x = game.config.width / 2 + distanceFromCenter * Math.cos(radians);
        this.player.y = game.config.height / 2 + distanceFromCenter * Math.sin(radians);

        // update player progress text
        this.playerLocation(this.player);

        // rotate player using trigonometry
        let revolutions = gameOptions.bigCircleRadius / gameOptions.playerRadius + 1;
        this.player.angle = -this.player.currentAngle * revolutions;
    }

    // method to convert Phaser angles to a more readable angles
    getGameAngle(angle) {
        let gameAngle = angle + 90;
        if (gameAngle < 0) {
            gameAngle = 360 + gameAngle
        }
        return gameAngle;
    }

    // method to merge intervals, found at
    // https://gist.github.com/vrachieru/5649bce26004d8a4682b
    mergeIntervals(intervals) {
        if (intervals.length <= 1) {
            return intervals;
        }
        let stack = [];
        let top = null;
        intervals = intervals.sort(function (a, b) {
            return a[0] - b[0]
        });
        stack.push(intervals[0]);
        for (let i = 1; i < intervals.length; i++) {
            top = stack[stack.length - 1];
            if (top[1] < intervals[i][0]) {
                stack.push(intervals[i]);
            }
            else {
                if (top[1] < intervals[i][1]) {
                    top[1] = intervals[i][1];
                    stack.pop();
                    stack.push(top);
                }
            }
        }
        return stack;
    }
    printPlayerLocationArray() {
        //console.log(JSON.stringify(gameLoopPlayerLocations))
    }
    playerLocation(player) {
        gameLoopCount++;

        if ((gameLoopCount % 5) === 0) {

            const x = player.x;
            const y = player.y;
            const currentLocation = { x, y };
            //console.log(`playerLocation ${gameLoopCount} % 5 `);
            gameLoopPlayerLocations.push([currentLocation]);
        }
    }
    enemyCollision(player, enemy) {

        //gameOver = true;
        //player.body.moves = false;
        console.log(`enemyCollision ${countOfCollisions++}`);
        gameOver = true;
       
        //gameText.setText("Game Over");
        //game.scene.pause("PlayGame");

    }
    gameOver() {
        //game.paused = true;
        //console.log(JSON.stringify(collisionArray));
        console.log("gameOver");
        
        game.scene.pause("PlayGame");
    }
    unloadGame() {
        console.log("unloadGame");
        game.destroy(true);
    }
}