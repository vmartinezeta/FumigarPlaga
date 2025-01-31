import { EventBus } from '../EventBus'
import Phaser , { Scene } from 'phaser'
import Player from '../sprites/Player'
import Plaga from '../sprites/Plaga'
import { Punto } from '../Punto'
import TanqueConAgua from '../sprites/TanqueConAgua'

export class Game extends Scene {
    constructor() {
        super('Game')
        this.group = null
        this.player = null
        this.perimetro = null
        this.emitter = null
        this.zona = null
        this.gameOver = false
        this.hembra = null
    }

    create() {
        this.add.image(512, 384, 'background');
        this.physics.world.setBounds(0, 0, 1024, 600 )

        this.createPerimetro()

        this.group = this.add.group()
        this.addPlagas(20)

        this.player = new Player(this, new Punto(100, 100), "player")
        this.zona = new Phaser.Geom.Rectangle(this.player.x, this.player.y, 60, 20)

        this.physics.add.collider(this.player, this.group, this.morir, null, this)
        this.physics.add.collider(this.perimetro, this.group, this.rotar, null, this)

        this.physics.add.collider(this.group, this.group, null, this.dejarReproducirse, this)


        this.input.mouse.disableContextMenu()
        this.input.on('pointerdown', function (pointer) {
            if (pointer.leftButtonDown()) {
                this.fumigar()                
            }
        }, this)

        this.keyboard = this.input.keyboard.createCursorKeys()

        EventBus.emit('current-scene-ready', this);
    }

    addPlagas(cantidad) {
        const base = this.game.config.width
        const altura = this.game.config.height
        for (let i = 1; i <= cantidad; i++) {
            const x = Math.random() * base
            const y = Math.random() * altura
            const hembra = Math.floor(Math.random() * 2)
            this.group.add(new Plaga(this, new Punto(x, y), "rana", Boolean(hembra)))
        }
    }

    dejarReproducirse(p1, p2) {
        const reproducirse = (p1.hembra && !p2.hembra)
        || (!p1.hembra && p2.hembra)
        if (reproducirse && p1.hembra) {
            this.hembra = p1
        } else if (reproducirse && p2.hembra) {
            this.hembra = p2
        }
        return !reproducirse
    }

    rotar(_, rana) {
        rana.rotar()
    }

    createPerimetro() {
        this.perimetro = this.add.graphics()
        this.perimetro.fillStyle(0xffff00, 0)
        this.perimetro.fillRect(0, 0, 2, 600)
        this.perimetro.fillRect(0, 0, 1024, 2)
        this.perimetro.fillRect(1022, 0, 2, 600)
        this.perimetro.fillRect(0, 598, 1024, 2)
        this.physics.world.enable(this.perimetro)
        this.perimetro.body.setImmovable(true)
    }

    fumigar() {
        const zona = { type: 'edge', source: this.zona, quantity: 42 }

        this.emitter = this.add.particles(0, 0, 'particle', {
            speed: 24,
            lifespan: 1500,
            quantity: 10,
            scale: { start: 0.4, end: 0 },
            emitZone: zona,
            duration: 500,
            emitting: false
        });
        
        this.emitter.start(2000);

    }

    morir(player, rana) {
        rana.destroy()
        player.vida --
        if (player.vida === 0) {
            this.scene.start('GameOver')
        }
    }

    changeScene() {
        this.scene.start('MainMenu')
    }

    update() {
        if (this.gameOver) return

        if (this.hembra){
            this.addPlagas(2)    
            if (this.hembra.parido>=3) {
                const base = this.game.config.width
                const altura = this.game.config.height
                const x = Math.random() * base
                const y = Math.random() * altura

                new TanqueConAgua(this, new Punto(x, y), "tanque")
                this.hembra.parido = 0
            }
            this.hembra.parido = this.hembra.parido+1
            this.hembra = null
        }

        if (this.keyboard.left.isDown) {
            this.player.anims.play("left", true)
            this.player.x -= 2
            if (!this.zona)return
            this.zona = new Phaser.Geom.Rectangle(this.player.x-160, this.player.y, 60, 20)
        } else if (this.keyboard.right.isDown) {
            this.player.anims.play("right", true)
            this.player.x += 2
            if (!this.zona)return
            this.zona = new Phaser.Geom.Rectangle(this.player.x+100, this.player.y, 60, 20)
        } else if (this.keyboard.up.isDown){
            this.player.anims.play("idle", true)
            this.player.y -= 2
            if (!this.zona)return
            this.zona = new Phaser.Geom.Rectangle(this.player.x, this.player.y-120, 60, 20)
        } else if (this.keyboard.down.isDown) {
            this.player.anims.play("idle", true)
            this.player.y += 2
            if (!this.zona)return
            this.zona = new Phaser.Geom.Rectangle(this.player.x, this.player.y+100, 60, 20)
        }

        if (this.keyboard.space.isDown) {
            this.fumigar()           
        }

        if (this.emitter) {
            this.group.getChildren().forEach(plaga => {
                const plagas = this.emitter.overlap(plaga.body)
                if (plagas.length === 0) return
                plaga.destroy()
            })
        }

        if (this.group.countActive()===0){
            this.gameOver = true
            setTimeout(() => {
                this.gameOver = false
                this.group = null
                this.player = null
                this.perimetro = null
                this.emitter = null
                this.zona = null
                this.hembra = false
                this.scene.start('GameOver')                
            }, 100)
        }

    }

}