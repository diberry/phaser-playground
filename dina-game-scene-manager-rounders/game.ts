
import "phaser";
import { BootScene } from "./scenes/boot-scene";
import { GameScene } from "./scenes/game-scene";
import { GameOverScene } from "./scenes/game-over-scene";


export class RoundersGame extends Phaser.Game {

    protected paused = false;

    constructor() {
        super({
            title: "Game example - manager",
            //url: "https://github.com/",
            version: "1.0",
            width: 800,
            height: 800,
            type: Phaser.CANVAS,
            parent: "game_content",
            //scene: [BootScene, GameScene, GameOverScene],
            //backgroundColor: "#ffffff",
            render: { pixelArt: false, antialias: true },
            physics: {
                default: 'arcade',
                arcade: {
                    debug: true
                }
            },

        });
        
        // states
        this.scene.add("BootScene", BootScene);
        this.scene.add("GameScene", GameScene);
        this.scene.add("GameOverScene", GameOverScene);
        
        // start
        this.scene.start("BootScene");
    }

    togglePause(scene: Phaser.Scene) {

        // @ts-ignore
        scene.physics.world.isPaused = (scene.physics.world.isPaused) ? false : true;

    }
    stop(scene: Phaser.Scene, removeCanvas: boolean = false, noReturn: boolean = false) {
        this.destroy(removeCanvas, noReturn);
    }

}
