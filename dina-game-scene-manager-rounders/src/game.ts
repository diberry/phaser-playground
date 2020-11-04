
import "phaser";
import { BootScene } from "./scenes/boot-scene";
import { GameScene } from "./scenes/game-scene";
import { GameOverScene } from "./scenes/game-over-scene";

export namespace RoundersGame {
    export class Game extends Phaser.Game {

        protected paused = false;
        protected relativeConfig = null;

        // @ts-ignore
        constructor(relativeConfig) {
            
            // @ts-ignore
            console.log(JSON.stringify(relativeConfig));
            
            // @ts-ignore
            super({
                title: "Game example - manager",
                version: "1.0",
                type: Phaser.CANVAS,
                parent: "game_content",
                render: { pixelArt: false, antialias: true },
                physics: {
                    default: 'arcade',
                    arcade: {
                        debug: true
                    }
                },
            });
        
            // incoming config
            this.relativeConfig = relativeConfig;
            
            // states
            this.scene.add("BootScene", BootScene);
            this.scene.add("GameScene", GameScene);
            this.scene.add("GameOverScene", GameOverScene);
        
            // start
            this.scene.start("BootScene", this.relativeConfig );
        }

        togglePause(scene: Phaser.Scene) {

            // @ts-ignore
            scene.physics.world.isPaused = (scene.physics.world.isPaused) ? false : true;

        }

        stop(scene: Phaser.Scene, removeCanvas: boolean = false, noReturn: boolean = false) {
            this.destroy(removeCanvas, noReturn);
        }

    }
}