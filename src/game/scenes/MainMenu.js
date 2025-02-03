import { EventBus } from '../EventBus'
import { Scene } from 'phaser'
import BasicAnimation from '../sprites/BasicAnimation';


export class MainMenu extends Scene {

    constructor() {
        super('MainMenu')
        this.animation = null        
    }

    create() {
        this.cameras.main.setBackgroundColor(0x00ff00);
        this.add.image(512, 384, 'background')

        this.animation = new BasicAnimation(this)

        EventBus.emit('current-scene-ready', this)
    }

    play() {
        this.scene.start('Game');
    }

    changeScene() {
        this.scene.start('HowTo');  
    } 

    moveLetra(reactCallback) {
        reactCallback(this.animation.getLetra())
        this.time.delayedCall(100, this.moveLetra, [reactCallback], this)
    }
}