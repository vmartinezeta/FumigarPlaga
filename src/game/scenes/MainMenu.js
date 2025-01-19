import { EventBus } from '../EventBus';
import { Scene } from 'phaser';


export class MainMenu extends Scene {

    constructor() {
        super('MainMenu')
    }

    create() {
        this.cameras.main.setBackgroundColor(0x00ff00);
        this.add.image(512, 384, 'background')
        // animación
        this.add.text(512, 284, 'Fumigar plagas', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100)

        const rana = this.add.sprite(512, 200, "rana")
        const manager = this.anims
        if (!manager.exists("walk")) {
            this.anims.create({
                key:"walk",
                frames: this.anims.generateFrameNumbers("rana",{
                    start:0, end:3
                }),
                frameRate:12,
                repeat:-1
            })
        }
        rana.anims.play("walk", true)
        EventBus.emit('current-scene-ready', this)
    }

    changeScene() {
        this.scene.start('Game');
    }    

    moveLogo(reactCallback) { }
}
