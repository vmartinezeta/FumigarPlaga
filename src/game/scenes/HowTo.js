import { EventBus } from '../EventBus'
import { Scene } from 'phaser'



export class HowTo extends Scene {

    constructor() {
        super('HowTo')
    }

    create() {
        this.cameras.main.setBackgroundColor(0x00ff00);
        this.add.image(512, 384, 'background')

        this.add.text(240, 140, "Controles del Teclado", {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 10,
            align: 'center'
        }).setOrigin(0.5).setDepth(100)


        this.add.text(150, 200, "Tecla A: Llenar el tanque con agua", {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 0,
            align: 'center'
        }).setOrigin(0).setDepth(100)

        this.add.text(150, 260, "Teclas direccionales: Mover al jugador", {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 0,
            align: 'center'
        }).setOrigin(0).setDepth(100)

        this.add.text(150, 320, "Tecla S: Fumigar las plagas", {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 0,
            align: 'center'
        }).setOrigin(0).setDepth(100)

        EventBus.emit('current-scene-ready', this)
    }

    changeScene() {
        this.scene.start('MainMenu');
    } 
}