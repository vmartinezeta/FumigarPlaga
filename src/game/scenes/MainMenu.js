import { EventBus } from '../EventBus';
import { Scene } from 'phaser';


export class MainMenu extends Scene {
    
    constructor() {
        super('MainMenu');        
        this.group = null
    }

    create() {
        this.add.image(512, 384, 'background');

        this.group = this.add.group();
        const TOTAL_RANAS = 50
        const base = 1000
        const altura = 600

        for (let i = 1; i <= TOTAL_RANAS; i++) {
            const x = Math.random() * base
            const y = Math.random() * altura
            const hembra = Math.floor(Math.random() * 2)
            this.group.add(this.createPlaga(x, y, hembra))
        }

        EventBus.emit('current-scene-ready', this);
    }

    createPlaga(x, y, hembra) {
        const rana = this.add.sprite(x, y, 'rana')
        rana.tint = hembra ? 0x00ffff : 0x00ff00
        rana.centroX = x
        rana.centroY = y
        rana.angulo = Math.random() * 2 * Math.PI
        rana.radio = Math.random() * 300
        rana.velocidad = 10 / 1000

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers(
                'rana',
                { start: 0, end: 3 }
            ),
            frameRate: 12,
            repeat: -1
        })

        rana.play("walk", true)

        return rana
    }

    update() {
        this.group.children.entries.forEach(child => {
            child.x = child.radio * Math.sin(child.angulo) + child.centroX
            child.y = child.radio * Math.cos(child.angulo) + child.centroY
            child.angulo += child.velocidad
        })
    }

    changeScene() {
        this.scene.start('Game');
    }

    moveLogo(reactCallback) { }
}
