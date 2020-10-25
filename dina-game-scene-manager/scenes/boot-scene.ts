export class BootScene extends Phaser.Scene {

    private message;
    
    constructor() {
        super({
            key: "BootScene"
        });
    }
    init(data): void {
        console.log(`BootScene init ${JSON.stringify(data)}`);
        this.message = data.message;
    }
    preload(): void {
        console.log(`BootScene preload`);
        this.cameras.main.setBackgroundColor(0xffffff);
        this.load.image("red", "./images/red.png");
    }
    create(): void {
        console.log(`BootScene create`);
        this.add.image(10, 10, "red");
        
        var textButton = this.add.text(
            30,
            30,
            "Boot scene",
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
        /*this.time.addEvent({
            delay: 3000,
            loop: false,
            callback: () => {
                
            }
        })*/
    }
    update(): void {
        //console.log(`BootScene update`);
    }
    end(): void {
        console.log(`BootScene end`);
    }
    moveToNextScene(item): void {
        console.log(`BootScene MoveToNextScene`);
        this.scene.start("GameScene", {
            "message": "Game scene"
        });
    }

}
