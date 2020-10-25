
import "phaser";
import { BootScene } from "./scenes/boot-scene";
import { GameScene } from "./scenes/game-scene";
import { GameOverScene } from "./scenes/game-over-scene";

const config: Phaser.Types.Core.GameConfig = {
    title: "Game example - manager",
    url: "https://github.com/",
    version: "1.0",
    width: 520,
    height: 700,
    type: Phaser.AUTO,
    parent: "game",
    scene: [BootScene, GameScene, GameOverScene],
    backgroundColor: "#ffffff",
    render: { pixelArt: false, antialias: true }
};

export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

window.addEventListener("load", () => {
    var game = new Game(config);
});
