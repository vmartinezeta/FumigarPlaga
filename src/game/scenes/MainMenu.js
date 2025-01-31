import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import Plaga from '../sprites/Plaga';
import { Punto } from '../Punto';


export class MainMenu extends Scene {

    constructor() {
        super('MainMenu')
    }

    create() {
        this.cameras.main.setBackgroundColor(0x00ff00);
        this.add.image(512, 384, 'background')

        this.add.text(512, 284, 'Fumigar plagas', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100)

        new Plaga(this, new Punto(512, 200), "rana", true)

        EventBus.emit('current-scene-ready', this)
    }

    changeScene() {
        this.scene.start('Game');
    }    

    // moveLogo(reactCallback) { }
}
