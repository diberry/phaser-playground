import { SceneBase } from "./scene-base";
import * as GameMath from "../../libs/math";

enum Jump {
    Jumping, // not on line
    NotJumping // on line
}

export class GameScene extends SceneBase {

    private gameLoop = 0;
    //private gameLoopPlayerLocations = [];
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
    protected nextScene = "";
    private completedCircle = false;
    private jump:Jump = Jump.NotJumping;


    private gameOptions = null;

    // @ts-ignore
    constructor() {
        console.log(`GameScene c'tor`);
        super({
            key: "GameScene"
        });
        this.nextScene = "GameOver";

        //this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#000000");
    }

    init(data): void {
        console.log(`GameScene init ${data}`);
        this.data = data;
        this.gameOptions = data.OPTIONS;
        this.gameOptions.gameLoopPlayerLocations = [];
        this.paintedArcs = [];
        this.gameLoopCount = 0;
        this.paintedRatio = undefined;
        this.completedCircle = false;
        this.jump = Jump.NotJumping;

    }
    preload(): void {
        console.log(`GameScene preload`);
        this.cameras.main.setBackgroundColor(this.gameOptions.background);
        this.load.image("blue", "./images/blue.png");
        this.load.image("player", "./images/orange.png");
        this.load.image("enemy", "./images/red.png");
    }
    createEnvironment() {

        // calculate the distance from the center of the canvas and the big circle
        this.distanceFromCenter = GameMath.distancefromCenterToObject(this.gameOptions.bigCircleRadius, this.gameOptions.playerRadius, this.gameOptions.bigCircleThickness);

        // draw the big circle
        this.bigCircle = GameMath.drawCircle(this, this.gameOptions.GAME_WIDTH, this.gameOptions.bigCircleThickness, this.gameOptions.bigCircleThickness, this.gameOptions.background);

        // graphics object where to draw the highlight circle
        this.highlightCircle = this.add.graphics();
    }
    createEnemy() {

        //const enemyX = game.config.width / 2;
        //const enemyY = game.config.height / 2 - this.distanceFromCenter;
        
        // determine angle to place enemy
        // change angle to x,y

        let enemy: Phaser.Physics.Arcade.Sprite = this.physics.add.sprite(135.3631732900355, 413.86902840433345, "enemy");
        // @ts-ignore
        enemy.enableBody = false;
        enemy.displayWidth = this.gameOptions.playerRadius / 2;
        enemy.displayHeight = this.gameOptions.playerRadius / 2;

        return enemy;
    }
    getEnemyRandomLocation() {
        // get angle 30% ahead of player upto 370% to player
        
        // get player's current angle
        // calc min and max enemy angle
        Phaser.Math.
        // set enemy at random angle
    }
    createPlayer() {
        // add player sprite
        let player = this.physics.add.sprite(this.gameOptions.GAME_WIDTH / 2, this.gameOptions.GAME_WIDTH / 2 - this.distanceFromCenter, "player");
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

    playerProgress() {
        const gameText = this.add.text(this.gameOptions.GAME_WIDTH / 2, this.gameOptions.GAME_WIDTH / 2, "", {
            fontFamily: "Arial",
            fontSize: 96,
            color: "#808080"
        });
        gameText.setOrigin(0.5);
        return gameText;
    }
    debugProgress() {
        const debugText = this.add.text(30, this.gameOptions.GAME_WIDTH - 20, "debug", {
            fontFamily: "Arial",
            fontSize: 96,
            color: "#808080"
        });
        debugText.setOrigin(0.5);
        return debugText;
    }
    create(): void {
        console.log(`GameScene create`);

        if (this.gameOptions.restart) {
            console.log("restart game scene");
            this.gameOptions.restart = false;
            this.scene.restart(this.data);
        }
        
        //------ Objects
        this.add.image(10, 10, "blue");
        this.createEnvironment();
        this.player = this.createPlayer();
        this.enemy = this.createEnemy();

        //------ Events
        
        // input listener
        this.input.on("pointerdown", this.playerJumpListener, this);

        // @ts-ignore
        this.physics.add.collider(this.player, this.enemy, this.enemyCollision.bind(this));
        
        //------ Text
        
        // text to display player progress
        this.gameText = this.playerProgress();

        // text to display debug info
        this.debugText = this.debugProgress();

    }
    playerJumpListener(): void {
        console.log("playerJumpListener");

        // if the player jumped less than 2 times...
        if (this.player.jumps < 2) {

            // one more jump
            this.player.jumps++;

            // add to player jump force the proper force according to the number of jumps performed
            this.player.jumpForce = this.gameOptions.jumpForce[this.player.jumps - 1];
        }
    }
    playerJumpOffsetAndForce() {
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
    isPlayerPastEnemy(player, enemy) {
        let playerAngle = GameMath.getGameAngle(this.player.currentAngle);
        let enemyAngle = null;
        if (playerAngle >= enemyAngle) {
            return true;
        }
        return false;
    }
    paintCircle() {
        // set painted ratio to zero
        // @ts-ignore
        this.paintedRatio = 0;

        // convert Phaser angles to a more readable angles where zero is on top, 90 is right, 180 down, 270 left
        let currentAngle = GameMath.getGameAngle(this.player.currentAngle);
        let previousAngle = GameMath.getGameAngle(this.player.previousAngle);

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
            console.log("playerDoesntJump - end of circle reached");
            this.completedCircle = true;
        }

        // prepare highlightCircle graphic object to draw
        this.highlightCircle.clear();
        this.highlightCircle.lineStyle(this.gameOptions.bigCircleThickness, 0xff00ff);

        // merge small arcs into bigger arcs, if possible
        this.paintedArcs = GameMath.mergeIntervals(this.paintedArcs);

        // loop through all arcs
        this.paintedArcs.forEach(function (i) {

            // increase painted ratio value with arc length
            this.paintedRatio += (i[1] - i[0]);

            // draw the arc
            this.highlightCircle.beginPath();
            this.highlightCircle.arc(this.gameOptions.GAME_WIDTH / 2, this.gameOptions.GAME_WIDTH / 2, this.gameOptions.bigCircleRadius, Phaser.Math.DegToRad(i[0] - 90), Phaser.Math.DegToRad(i[1] - 90), false);
            this.highlightCircle.strokePath();
        }.bind(this));

        // convert the sum of all arcs lenght into a 0 -> 100 value
        // @ts-ignore
        this.paintedRatio = Math.round(this.paintedRatio * 100 / 360);

        this.gameText.setText(this.paintedRatio + "%");
        this.debugText.setText(`${this.player.x.toString().substring(0, 6)}, ${this.player.y.toString().substring(0, 6)}, angle=${this.player.currentAngle}`);

        // if the player painted the whole circle...
        if (((this.paintedRatio == 101) || (this.completedCircle)) && (this.gameOptions.endOfGame.oneHundredPercentCircle)) {

            this.pauseAndMoveScene(3000, this.nextScene, this.data);

        }
        if (this.moveScene === true) {
            console.log("Update - move scene ==== true")
            this.end();
        }
    }
    update(): void {
        console.log(`GameScene update`);

        //-------------------------------
        // if the player is jumping...
        if (this.player.jumps > 0) {
            this.jump = Jump.Jumping
            this.playerJumpOffsetAndForce();
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

        // if player is not jumping..highlight circle.
        if (this.player.jumpOffset == 0) {
            
            // just jumped
            if (this.jump === Jump.Jumping) {
                
            }
            this.jump = Jump.NotJumping;
            
            // is player past enemy?
            
            this.paintCircle();
        }

        // transform degrees to radians
        let radians = Phaser.Math.DegToRad(this.player.currentAngle);

        // determine distance from center according to jump offset
        let distanceFromCenter = this.distanceFromCenter - this.player.jumpOffset;

        // position player using trigonometry
        this.player.x = this.gameOptions.GAME_WIDTH / 2 + distanceFromCenter * Math.cos(radians);
        this.player.y = this.gameOptions.GAME_WIDTH / 2 + distanceFromCenter * Math.sin(radians);

        // update player progress text
        this.capturePlayerLocation(this.player);

        // rotate player using trigonometry
        let revolutions = this.gameOptions.bigCircleRadius / this.gameOptions.playerRadius + 1;
        this.player.angle = -this.player.currentAngle * revolutions;
    }
    end(): void {
        console.log(`GameScene end`);
        console.log(JSON.stringify(this.gameOptions.gameLoopPlayerLocations));
        this.pauseAndMoveScene(1000, this.nextScene, this.data);

    }

    enemyCollision(player, enemy, event) {

        console.log("enemyCollision")

        if (this.gameOptions.endOfGame.collisionWithEnemy) this.pauseAndMoveScene(3000, this.nextScene, this.data);

    }
    // use to capture player location for entire circle
    capturePlayerLocation(player) {

        this.gameLoop++;

        //if ((this.gameLoop % 5) === 0) {

        const x = player.x;
        const y = player.y;
        const currentLocation = { x, y };
        this.gameOptions.gameLoopPlayerLocations.push([currentLocation]);
        //}
    }
    // method to convert Phaser angles to a more readable angles

}
