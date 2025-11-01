import { EventBus } from '../EventBus'
import { Scene } from 'phaser'


export class HowTo extends Scene {
    constructor() {
        super('HowTo')
    }

    create() {
        this.container = this.add.container(100, 100);
        const bg = this.add.rectangle(200, 40, 500, 50, 0x00aa00);
        this.container.add(bg);
        this.add.text(240, 140, "Controles del Teclado", {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setDepth(100)


        this.add.text(150, 200, "Tecla A: Recargar el fierro(Honda, Bomba, Lanza llamas y lanza humo)", {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 0,
            align: 'center'
        }).setOrigin(0).setDepth(100)

        this.add.text(150, 260, "Teclas direccionales: Mover al jugador", {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 0,
            align: 'center'
        }).setOrigin(0).setDepth(100)

        this.add.text(150, 320, "Barra espaciadora: Disparar el fierro", {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 0,
            align: 'center'
        }).setOrigin(0).setDepth(100);

        this.add.text(150, 380, "Teclas 1, 2, 3 y 4: Cambiar de fierro", {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 0,
            align: 'center'
        }).setOrigin(0).setDepth(100);

        EventBus.emit('current-scene-ready', this)
    }

    changeScene(key) {
        this.scene.start(key);
        return this.scene.manager.getScene(key);
    }

}