import { EventBus } from '../EventBus'
import { Scene } from 'phaser'
import Aplastador from '../sprites/Aplastador'

export class MainMenu extends Scene {

    constructor() {
        super('MainMenu')
        this.aplastador = null        
    }

    create() {
        this.cameras.main.setBackgroundColor(0x00ff00);
        this.add.image(512, 384, 'background')

        this.aplastador = new Aplastador(this)

        EventBus.emit('current-scene-ready', this)
    }

    changeScene() {
        this.scene.start('Game');
    }    

    moveLetra(reactCallback) {
        reactCallback(this.aplastador.getLetra())
        this.time.delayedCall(100, this.moveLetra, [reactCallback], this)
    }
}
