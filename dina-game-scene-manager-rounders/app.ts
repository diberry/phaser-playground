import { RoundersGame } from './game';


namespace App {

    // game
    export let game: Phaser.Game = null;
}
function launch(): void {

    let game = new RoundersGame();
    App.game = game;
}

window.onload = launch;