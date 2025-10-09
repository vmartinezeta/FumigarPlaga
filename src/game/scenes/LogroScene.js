import { EventBus } from '../EventBus'
import { Scene } from 'phaser'



export class LogroScene extends Scene {
    constructor() {
        super('LogroScene');
    }

    create() {
        this.add.text(this.game.config.width/2, 50, "LOGROS", {
            fontSize: '26px',
            fill: '#ecf0f1'
        }).setOrigin(0.5);

        EventBus.emit('current-scene-ready', this)
    }

    changeScene(key) {
        this.scene.start(key);
        return this.scene.manager.getScene(key);
    }

}