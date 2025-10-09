import { EventBus } from '../EventBus'
import { Scene } from 'phaser'
import AchievementContainer from '../sprites/Achivements/AchievementContainer';


export class LogroScene extends Scene {
    constructor() {
        super('LogroScene');
    }

    create() {
        this.add.text(this.game.config.width/2, 50, "LOGROS", {
            fontSize: '26px',
            fill: '#ecf0f1'
        }).setOrigin(0.5);

        const logros = JSON.parse(localStorage.getItem('gameAchievements') || "[]")
        new AchievementContainer(this, 200, 120, logros);

        EventBus.emit('current-scene-ready', this)
    }

    changeScene(key) {
        this.scene.start(key);
        return this.scene.manager.getScene(key);
    }

}