///<reference path = "scene-base.ts" />

import { SceneBase } from "./scene-base";

    export class BootScene extends SceneBase {

        //private data;
    
        constructor() {
            console.log("boot-scene");
            super({
                key: "BootScene"
            });
        }
        init(data): void {
            this.data = data;
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
                this.moveToNextScene(event, this.data);
            });
        }
        update(): void {
            //console.log(`BootScene update`);
        }
        end(): void {
            console.log(`BootScene end`);
        }
        moveToNextScene(item, data): void {
            console.log(`BootScene MoveToNextScene`);
            this.scene.start("GameScene", { ...this.data, "restart": true });
        }

    }

