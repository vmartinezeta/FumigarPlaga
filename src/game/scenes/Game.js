import { EventBus } from '../EventBus'
import Phaser, { Scene } from 'phaser'
import Player from '../sprites/Player'
import Plaga from '../sprites/Plaga'
import { Punto } from '../classes/Punto'
import { Tanque } from '../classes/Tanque'
import PotenciadorGroup from '../sprites/PotenciadorGroup'
import PlagaGroup from '../sprites/PlagaGroup'
import BarraEstado from '../sprites/BarraEstado'
import Potenciador from '../sprites/Potenciador'


export class Game extends Scene {
    constructor() {
        super('Game')
        this.plagaGroup = null
        this.borders = null
        this.player = null
        this.emitter = null
        this.zona = null
        this.gameOver = false
        this.tanque = null
        this.potenciadorGroup = null
        this.fumigando = false
    }

    create() {
        this.add.image(512, 384, 'background')
        this.physics.world.setBounds(0, 0, 1024, 600)

        this.plano2D()

        this.barraEstado = new BarraEstado(this, {
            x: 100,
            y: 30,
            vida: 10,
            capacidad: 10
        })

        this.plagaGroup = new PlagaGroup(this, this.createPlagas(12))

        this.potenciadorGroup = new PotenciadorGroup(this)

        this.player = new Player(this, new Punto(100, 100), "player")
        this.zona = new Phaser.Geom.Rectangle(this.player.x, this.player.y, 60, 20)
        this.tanque = new Tanque()

        this.potenciadorGroup = new PotenciadorGroup(this)

        this.collider()

        this.input.mouse.disableContextMenu()

        this.keyboard = this.input.keyboard.createCursorKeys()

        this.keys = this.input.keyboard.addKeys({
            A: Phaser.Input.Keyboard.KeyCodes.A, //coger el potenciador
            W: Phaser.Input.Keyboard.KeyCodes.W,
            S: Phaser.Input.Keyboard.KeyCodes.S, //fumigar
            D: Phaser.Input.Keyboard.KeyCodes.D
        })
        EventBus.emit('current-scene-ready', this)
    }

    collider() {
        this.physics.add.collider(this.player, this.plagaGroup, this.morir, this.quitarVida, this)
        this.physics.add.collider(this.borders, this.plagaGroup, this.rotar, null, this)
        this.physics.add.collider(this.plagaGroup, this.plagaGroup, this.cogiendo, this.coger, this)
        this.physics.add.collider(this.player, this.potenciadorGroup, this.llenarTanque, this.activarTanque, this)
    }

    plano2D() {
        this.borders = this.physics.add.group()
        this.createSpriteHorizontal(6, 0, 0, "platform")
        this.createSpriteVertical(4, 1024, 0, "platform")
        this.createSpriteHorizontal(6, 0, 600, "platform")
        this.createSpriteVertical(4, 0, 0, "platform")
    }

    createSpriteVertical(cantidad, x, y, texture){
        for (let i = 0; i < cantidad; i++) {
            const sprite = this.borders.create(x, i * 200+y, texture)
            sprite.angle = 90
            sprite.body.allowGravity = false
            sprite.body.immovable = true
        }
    }

    createSpriteHorizontal(cantidad, x, y, texture){
        for (let i = 0; i < cantidad; i++) {
            const sprite = this.borders.create(i*200+x, y, texture)
            sprite.body.allowGravity = false
            sprite.body.immovable = true
        }
    }

    rotar(sprite) {
        if (sprite instanceof Plaga) {
            sprite.rotar()
        }
    }

    cogiendo(hembra, macho) {
        macho.x = hembra.x
        macho.y = hembra.y

        let sprite = hembra
        if (!sprite.hembra) {
            sprite = macho
        }
        sprite.update()

        if (sprite.hembra && !sprite.estaCogiendo) {
            if (this.plagaGroup.countActive() < 350) {
                this.plagaGroup.addMultiple(this.createPlagas(2))
            }
            sprite.soltar()
            this.plagaGroup.total++
        }
    }

    activarTanque() {
        if (this.keys.A.isDown) {
            return true
        }
        return false
    }

    createPlagas(cantidad) {
        const base = this.game.config.width
        const altura = this.game.config.height
        const plagas = []
        for (let i = 1; i <= cantidad; i++) {
            const x = Math.random() * base
            const y = Math.random() * altura
            const hembra = Math.floor(Math.random() * 2)
            plagas.push(new Plaga(this, new Punto(x, y), "rana", Boolean(hembra)))
        }
        return plagas
    }

    llenarTanque(_, tanque) {
        this.potenciadorGroup.remove(tanque, true, true)
        this.tanque.reset()
        this.barraEstado.actualizar(this.player.vida, this.tanque.capacidad)
    }

    coger(hembra, macho) {
        let sprite = hembra
        if (!sprite.hembra) {
            sprite = macho
        }
        const pareja = hembra.hembra !== macho.hembra
        if (pareja) {
            sprite.tienePareja = true
        }
        return sprite.tienePareja && sprite.estaCogiendo
    }

    fumigar() {
        if (this.tanque.estaVacio()) return

        const zona = { type: 'edge', source: this.zona, quantity: 42 }
        this.tanque.vaciar()
        this.barraEstado.actualizar(this.player.vida, this.tanque.capacidad)


        this.emitter = this.add.particles(0, 0, 'particle', {
            speed: 24,
            lifespan: 1500,
            quantity: 10,
            scale: { start: 0.4, end: 0 },
            emitZone: zona,
            duration: 500,
            emitting: false
        })

        this.emitter.start(2000)
    }

    quitarVida() {
        return true
    }

    morir(player, rana) {
        rana.destroy()
        player.vida--
        this.barraEstado.actualizar(player.vida, this.tanque.capacidad)
        if (player.vida === 0) {
            this.scene.start('GameOver')
        }
    }

    changeScene() {
        this.scene.start('MainMenu')
    }

    reset() {
        this.gameOver = false
        this.plagaGroup = null
        this.player = null
        this.borders = null
        this.emitter = null
        this.zona = null
    }

    update() {
        if (this.gameOver) return

        if (this.plagaGroup.total > this.plagaGroup.countActive() / 2 ) {
            const x = Math.random() * this.game.config.width
            const y = Math.random() * this.game.config.height
            const potenciador = new Potenciador(this, new Punto(x, y), "tanque")
            this.potenciadorGroup.addPotenciador(potenciador)
            this.plagaGroup.total = 0
        }

        if (this.keyboard.left.isDown) {
            this.player.left()
            if (!this.zona) return
            this.zona = new Phaser.Geom.Rectangle(this.player.x - 160, this.player.y, 60, 20)
        } else if (this.keyboard.right.isDown) {
            this.player.right()
            if (!this.zona) return
            this.zona = new Phaser.Geom.Rectangle(this.player.x + 100, this.player.y, 60, 20)
        } else if (this.keyboard.up.isDown) {
            this.player.top()
            if (!this.zona) return
            this.zona = new Phaser.Geom.Rectangle(this.player.x, this.player.y - 120, 60, 20)
        } else if (this.keyboard.down.isDown) {
            this.player.bottom()
            if (!this.zona) return
            this.zona = new Phaser.Geom.Rectangle(this.player.x, this.player.y + 100, 60, 20)
        }

        if (!this.fumigando && this.keys.S.isDown) {
            this.fumigando = true
            this.fumigar()
        } else {
            this.fumigando = false
        }

        if (this.emitter) {
            this.plagaGroup.getChildren().forEach(plaga => {
                const plagas = this.emitter.overlap(plaga.body)
                if (plagas.length > 0) {
                    plaga.update()
                    if (plaga.vida === 0) {
                        this.plagaGroup.remove(plaga, true, true)
                    }
                }
            })
        }

        if (this.plagaGroup.countActive() === 0) {
            this.gameOver = true
            this.reset()
            this.scene.start('GameOver')
        }
    }
}