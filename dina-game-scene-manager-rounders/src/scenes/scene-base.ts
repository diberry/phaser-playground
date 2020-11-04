

export class SceneBase extends Phaser.Scene {

    // --------------------------------------------------------------------
    public get gameWidth(): number {
        return this.sys.game.config.width as number;
    }

    // --------------------------------------------------------------------
    public get gameHeight(): number {
        return this.sys.game.config.height as number;
    }

    // --------------------------------------------------------------------
    protected setView(): void {
        // focus on center
        this.cameras.main.centerOn(0, 0);
    }
    protected pauseAndMoveScene(delayInMs, nextScene, nextSceneData): void {

        console.log(`scene-base::pauseAndMoveScene`);
        console.log(`${nextScene}`);
        console.log(`${JSON.stringify(nextSceneData)}`);
        this.scene.start(nextScene, nextSceneData);
    }



}
