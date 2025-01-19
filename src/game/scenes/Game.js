import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.group = null
        this.player = null
    }

    // create() {
    //     this.cameras.main.setBackgroundColor(0x00ff00);

    //     this.add.image(512, 384, 'background').setAlpha(0.5);

    //     // this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
    //     //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
    //     //     stroke: '#000000', strokeThickness: 8,
    //     //     align: 'center'
    //     // }).setOrigin(0.5).setDepth(100);

    //     EventBus.emit('current-scene-ready', this);
    // }

    create() {
        this.add.image(512, 384, 'background');

        this.group = this.add.group();
        const TOTAL_RANAS = 50
        const base = 1000
        const altura = 600

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers(
                'rana',
                { start: 0, end: 3 }
            ),
            frameRate: 12,
            repeat: -1
        })

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(
                'player',
                { start: 5, end: 8 }
            ),
            frameRate: 12,
            repeat: -1
        })

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(
                'player',
                { start: 0, end: 3 }
            ),
            frameRate: 12,
            repeat: -1
        })

        this.anims.create({
            key: 'idle',
            frames: [{ key: "player", frame: 4 }],
            frameRate: 12,
            repeat: -1
        })


        for (let i = 1; i <= TOTAL_RANAS; i++) {
            const x = Math.random() * base
            const y = Math.random() * altura
            const hembra = Math.floor(Math.random() * 2)

            this.group.add(this.createPlaga(x, y, hembra))
        }

        this.player = this.createPlayer(100, 100)

        this.physics.add.collider(this.player, this.group, this.morir, null, this)


        this.input.mouse.disableContextMenu();

        this.input.on('pointerdown', function (pointer) {
            if (pointer.leftButtonDown()) {
                this.player.x = pointer.x
                this.player.y = pointer.y
            }
        }, this)

        EventBus.emit('current-scene-ready', this);
    }

    morir(player, rana) {
        rana.destroy()
        player.vida --
        if (player.vida === 0) {
            this.scene.start('GameOver')
        }
    }

    createPlaga(x, y, hembra) {
        const rana = this.add.sprite(x, y, 'rana')
        rana.tint = hembra ? 0x00ffff : 0x00ff00
        rana.centroX = x
        rana.centroY = y
        rana.angulo = Math.random() * 2 * Math.PI
        rana.radio = Math.random() * 300
        rana.velocidad = 10 / 1000
        this.physics.world.enable(rana)
        rana.play("walk", true)
        return rana
    }

    createPlayer(x, y) {
        const player = this.add.sprite(x, y, 'player')
        player.vida = 10
        player.play("right", true)
        this.physics.world.enable(player)
        return player
    }

    update() {
        this.group.children.entries.forEach(child => {
            child.x = child.radio * Math.sin(child.angulo) + child.centroX
            child.y = child.radio * Math.cos(child.angulo) + child.centroY
            child.angulo += child.velocidad
        })

    }

    changeScene() {
        this.scene.start('MainMenu')
    }

}
