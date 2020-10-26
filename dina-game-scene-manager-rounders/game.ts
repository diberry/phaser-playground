
import "phaser";
import { BootScene } from "./scenes/boot-scene";
import { GameScene } from "./scenes/game-scene";
import { GameOverScene } from "./scenes/game-over-scene";

const config: Phaser.Types.Core.GameConfig = {
    title: "Game example - manager",
    //url: "https://github.com/",
    version: "1.0",
    width: 800,
    height: 800,
    type: Phaser.CANVAS,
    parent: "game",
    scene: [BootScene, GameScene, GameOverScene],
    backgroundColor: "#ffffff",
    render: { pixelArt: false, antialias: true },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    
};

export class Game extends Phaser.Game {
    
    protected paused = false;
    
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
    
    togglePause(scene: Phaser.Scene) {

        // @ts-ignore
        scene.physics.world.isPaused = (scene.physics.world.isPaused) ? false : true;

    }
    stop(scene: Phaser.Scene, removeCanvas: boolean = false, noReturn: boolean = false) {
        this.destroy(removeCanvas, noReturn);
    }

}

window.addEventListener("load", () => {
    var game = new Game(config);
});
