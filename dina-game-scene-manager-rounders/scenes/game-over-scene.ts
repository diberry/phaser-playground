export class GameOverScene extends Phaser.Scene {

    private message;

    constructor() {
        super({
            key: "GameOver"
        });
    }

    init(data): void {
        console.log(`GameOver init ${data}`);
        this.message = data.message;
    }
    preload(): void {
        console.log(`GameOver preload`);
        this.cameras.main.setBackgroundColor(0xffffff);
        this.load.image("orange", "./images/orange.png");
    }
    create(): void {
        console.log(`GameOver create`);
        this.add.image(10, 10, "orange");

        var textButton = this.add.text(
            30,
            30,
            this.message + " - restart",
            {
                fontSize: 10,
                color: "#000000",
                fontStyle: "bold"
            }
        ).setOrigin(-0.5);
        textButton.setInteractive();
        textButton.on('pointerdown', (event) => {
            console.log('pointerdown');
            this.moveToNextScene(event);
        });
        
        var endButton = this.add.text(
            30,
            60,
            "exit",
            {
                fontSize: 10,
                color: "#444444",
                fontStyle: "bold"
            }
        ).setOrigin(-0.5);
        endButton.setInteractive();
        endButton.on('pointerdown', (event) => {
            this.sys.game.destroy(true);
        });
    }
    update(): void {
        //console.log(`GameOver update`);
    }
    end(): void {
        console.log(`GameOver end`);
    }
    moveToNextScene(item): void {
        console.log(`GameOver MoveToNextScene`);
        this.scene.start("BootScene", {
            "message": "coming from Game Over"
        });
    }
}
