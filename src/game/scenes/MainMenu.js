import { EventBus } from '../EventBus';
import { Scene } from 'phaser';


export class MainMenu extends Scene {

    constructor() {
        super('MainMenu')
    }

    create() {
        this.add.image(512, 384, 'background');
        EventBus.emit('current-scene-ready', this);
    }

    changeScene() {
        this.scene.start('Game');
    }    

    moveLogo(reactCallback) { }
}
