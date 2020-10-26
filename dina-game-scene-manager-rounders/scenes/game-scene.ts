export class GameScene extends Phaser.Scene {

    private gameLoop = 0;
    private gameLoopPlayerLocations = [];
    private message;
    private player;
    private paintedArcs = [];
    private distanceFromCenter = 0;
    private bigCircle;
    private highlightCircle;
    private enemy;
    private gameText;
    private gameLoopCount;
    private paintedRatio;
    private debugText;
    private moveScene = false;
    
    private gameOptions = {

        // radius of the big circle, in pixels
        bigCircleRadius: 300,

        // thickness of the big circle, in pixels
        bigCircleThickness: 20,

        // radius of the player, in pixels
        playerRadius: 25,

        // player speed, in degrees per frame
        playerSpeed: 0.8,

        // world gravity
        worldGravity: 0.9,

        // jump force of the single and double jump
        jumpForce: [15, 10],
        
        // pause animation after collision, in seconds
        collisionTimeout: 2
    };
    constructor() {
        super({
            key: "GameScene"
        });
    }

    init(data): void {
        console.log(`GameScene init ${data}`);
        this.message = data.message;
        
        
    }
    preload(): void {
        console.log(`GameScene preload`);
        this.cameras.main.setBackgroundColor(0xffffff);
        this.load.image("blue", "./images/blue.png");
        
        this.load.image("player", "./images/orange.png");
        this.load.image("enemy", "./images/red.png");
    }
    createEnvironment() {

        // calculate the distance from the center of the canvas and the big circle
        this.distanceFromCenter = this.gameOptions.bigCircleRadius - this.gameOptions.playerRadius - this.gameOptions.bigCircleThickness / 2;

        // draw the big circle
        this.bigCircle = this.add.graphics();
        this.bigCircle.lineStyle(this.gameOptions.bigCircleThickness, 0xffffff);
        this.bigCircle.strokeCircle(800 / 2, 800 / 2, this.gameOptions.bigCircleRadius);

        // graphics object where to draw the highlight circle
        this.highlightCircle = this.add.graphics();
    }
    createEnemy() {
        //const enemyX = game.config.width / 2;
        //const enemyY = game.config.height / 2 - this.distanceFromCenter;

        let enemy: Phaser.Physics.Arcade.Sprite = this.physics.add.sprite(135.3631732900355, 413.86902840433345, "enemy");
        // @ts-ignore
        enemy.enableBody = false;
        enemy.displayWidth = this.gameOptions.playerRadius / 2;
        enemy.displayHeight = this.gameOptions.playerRadius / 2;

        return enemy;
    }
    createPlayer() {
        // add player sprite
        let player = this.physics.add.sprite(800 / 2, 800 / 2 - this.distanceFromCenter, "player");
        player.displayWidth = this.gameOptions.playerRadius * 2;
        player.displayHeight = this.gameOptions.playerRadius * 2;

        // player current angle, on top of the big circle
        // @ts-ignore
        player.currentAngle = -90;

        // player previous angle, at the moment same value of current angle
        // @ts-ignore
        player.previousAngle = player.currentAngle;

        // jump offset, the distance from the ground and player position during jumps
        // @ts-ignore
        player.jumpOffset = 0;

        // counter to keep track of player jumps
        // @ts-ignore
        player.jumps = 0;

        // current jump force
        // @ts-ignore
        player.jumpForce = 0;

        return player;

    }
    create(): void {
        console.log(`GameScene create`);
        this.add.image(10, 10, "blue");
        
        //-------------------------------
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
                this.player.jumpForce = this.gameOptions.jumpForce[this.player.jumps - 1];
            }
        }, this);
        
        // text to display player progress
        this.gameText = this.add.text(800 / 2, 800 / 2, "", {
            fontFamily: "Arial",
            fontSize: 96,
            color: "#00ff00"
        });
        this.gameText.setOrigin(0.5);

        this.debugText = this.add.text(30, 800 - 20, "", {
            fontFamily: "Arial",
            fontSize: 20,
            color: "#00ff00"
        });
        
        //@ts-ignore
        this.physics.add.collider(this.player, this.enemy, this.enemyCollision.bind(this));
    }
    update(): void {
        //console.log(`GameScene update`);
        
        //-------------------------------
        // if the player is jumping...
        if (this.player.jumps > 0) {

            // increase player jump offset according to jump force
            this.player.jumpOffset += this.player.jumpForce;

            // decrease jump force ti simulate gravity
            this.player.jumpForce -= this.gameOptions.worldGravity;

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
        this.player.currentAngle = Phaser.Math.Angle.WrapDegrees(this.player.currentAngle + this.gameOptions.playerSpeed);

        // make enemy enabled
        if (this.gameLoopCount > 10) {
            // show enemy - collision can now happen
            this.enemy.enableBody = false;
        }

        // if player is not jumping...
        if (this.player.jumpOffset == 0) {

            // set painted ratio to zero
            // @ts-ignore
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
            this.highlightCircle.lineStyle(this.gameOptions.bigCircleThickness, 0xff00ff);

            // merge small arcs into bigger arcs, if possible
            this.paintedArcs = this.mergeIntervals(this.paintedArcs);

            // loop through all arcs
            this.paintedArcs.forEach(function (i) {

                // increase painted ratio value with arc length
                this.paintedRatio += (i[1] - i[0]);

                // draw the arc
                this.highlightCircle.beginPath();
                this.highlightCircle.arc(800 / 2, 800 / 2, this.gameOptions.bigCircleRadius, Phaser.Math.DegToRad(i[0] - 90), Phaser.Math.DegToRad(i[1] - 90), false);
                this.highlightCircle.strokePath();
            }.bind(this));

            // convert the sum of all arcs lenght into a 0 -> 100 value
            // @ts-ignore
            this.paintedRatio = Math.round(this.paintedRatio * 100 / 360);

            if (this.paintedRatio === 100) {
                this.moveScene = true;
            } else {
                this.gameText.setText(this.paintedRatio + "%");
            }
            this.debugText.setText(`${this.player.x.toString().substring(0, 6)}, ${this.player.y.toString().substring(0, 6)}`);

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
            if (this.moveScene === true) {
                this.end();
            }
        }

        // transform degrees to radians
        let radians = Phaser.Math.DegToRad(this.player.currentAngle);

        // determine distance from center according to jump offset
        let distanceFromCenter = this.distanceFromCenter - this.player.jumpOffset;

        // position player using trigonometry
        this.player.x = 800 / 2 + distanceFromCenter * Math.cos(radians);
        this.player.y = 800 / 2 + distanceFromCenter * Math.sin(radians);

        // update player progress text
        this.playerLocation(this.player);

        // rotate player using trigonometry
        let revolutions = this.gameOptions.bigCircleRadius / this.gameOptions.playerRadius + 1;
        this.player.angle = -this.player.currentAngle * revolutions;        
    }
    end(): void {
        console.log(`GameScene end`);
        //this.physics.world.isPaused = true;
        this.scene.start("GameOver", {
            "message": "End Game scene"
        });
    }
    enemyCollision(player, enemy, event) {

        // pause 2 seconds then go to end game scene
        console.log(`GameScene enemyCollision`);
        //this.physics.world.isPaused = true;
        this.moveScene = true;
    }
    // use to capture player location for entire circle
    playerLocation(player) {
        this.gameLoop++;

        if ((this.gameLoop % 5) === 0) {

            const x = player.x;
            const y = player.y;
            const currentLocation = { x, y };
            this.gameLoopPlayerLocations.push([currentLocation]);
        }
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
}
