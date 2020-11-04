import { RoundersGame } from './game';
//import { Utils } from '../libs/utilities';
import * as appConfig from './game.json';

namespace App {

    // game
    export let game: Phaser.Game = null;   
    
}
async function launch(): Promise<void> {

    let configJson: any = null;
    try {
        //configJson = await Utils.ObjectUtils.loadJson(appConfig);
        //console.log(JSON.stringify(configJson))
        //Utils.ObjectUtils.loadValuesIntoObject(configJson, App.Config);
        let game = new RoundersGame.Game(appConfig);
        App.game = game;        
    } catch (e) {
        throw e;
    }

}

window.onload = launch;