export class GameScene extends Phaser.Scene {

    private message;
    
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
    }
    create(): void {
        console.log(`GameScene create`);
        this.add.image(10, 10, "blue");
        
        var textButton = this.add.text(
            30,
            30,
            this.message + "  - end game",
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
    }
    update(): void {
        //console.log(`GameScene update`);
    }
    end(): void {
        console.log(`GameScene end`);
    }
    moveToNextScene(item): void {
        console.log(`GameScene MoveToNextScene`);
        this.scene.start("GameOver", {
            "message": "End Game scene"
        });
    }
}
