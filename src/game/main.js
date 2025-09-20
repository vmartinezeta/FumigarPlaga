import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';
import { HowTo } from './scenes/HowTo';
import { NightScene } from './scenes/NightScene';

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#028af8',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {y:0}
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Game,
        NightScene,
        GameOver,
        HowTo
    ]
}

const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });

}

export default StartGame;
