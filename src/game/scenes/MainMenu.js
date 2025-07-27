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

    changeScene(key) {
        this.scene.start(key);
        return this.scene.manager.getScene(key)
    } 

    moveLetra(reactCallback) {
        this.animation.reset()
        this.animation.getLetra((letra) => {
            reactCallback(letra)
            if (letra.isUltima()) {
                this.animation.parar()
            }
        })
    }

    cancelAnimation() {
        this.animation.destroy()
        this.animation = null
    }
}