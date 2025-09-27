import { EventBus } from '../EventBus'
import { Scene } from 'phaser'


export class LogroScene extends Scene {
    constructor() {
        super('LogroScene');
    }

    create() {
        EventBus.emit('current-scene-ready', this)
    }

    changeScene(key) {
        this.scene.start(key);
        return this.scene.manager.getScene(key);
    }

}