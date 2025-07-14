import { EventBus } from '../EventBus'
import Phaser, { Scene } from 'phaser'
import { Punto } from '../classes/Punto'
import { Tanque } from '../classes/Tanque'
import Player from '../sprites/Player'
import Plaga from '../sprites/Plaga'
import PotenciadorGroup from '../sprites/PotenciadorGroup'
import PlagaGroup from '../sprites/PlagaGroup'
import BarraEstado from '../sprites/BarraEstado'
import TanqueConAgua from '../sprites/TanqueConAgua'
import Vida from '../sprites/Vida'


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

        this.plagaGroup = new PlagaGroup(this, this.createPlagas(20))

        this.potenciadorGroup = new PotenciadorGroup(this)

        this.player = new Player(this, new Punto(100, 100), "player")
        this.zona = new Phaser.Geom.Rectangle(this.player.x, this.player.y, 60, 20)
        this.tanque = new Tanque()

        this.detectarColision()

        this.time.delayedCall(6000, this.suministrarVida, [], this);

        this.input.mouse.disableContextMenu()

        this.keyboard = this.input.keyboard.createCursorKeys()

        this.keys = this.input.keyboard.addKeys({
            A: Phaser.Input.Keyboard.KeyCodes.A, //Coger el potenciador
            W: Phaser.Input.Keyboard.KeyCodes.W,
            S: Phaser.Input.Keyboard.KeyCodes.S, //fumigar
            D: Phaser.Input.Keyboard.KeyCodes.D
        })
        EventBus.emit('current-scene-ready', this)
    }

    detectarColision() {
        this.physics.add.collider(this.player, this.plagaGroup, this.morir, null, this)
        this.physics.add.collider(this.plagaGroup, this.borders, this.rotar, null, this)
        this.physics.add.collider(this.plagaGroup.getPasivos(), this.plagaGroup.getPasivos(), this.cogiendo, this.coger, this)
        this.physics.add.overlap(this.player, this.potenciadorGroup, this.aplicarPotenciador, this.activarPotenciador, this)
    }

    plano2D() {
        this.borders = this.physics.add.group()
        this.createSpriteHorizontal(6, 0, 0, "platform")
        this.createSpriteVertical(4, 1024, 0, "platform")
        this.createSpriteHorizontal(6, 0, 600, "platform")
        this.createSpriteVertical(4, 0, 0, "platform")
    }

    createSpriteVertical(cantidad, x, y, texture) {
        for (let i = 0; i < cantidad; i++) {
            const sprite = this.borders.create(x, i * 200 + y, texture)
            sprite.angle = 90
            sprite.body.allowGravity = false
            sprite.body.immovable = true
        }
    }

    createSpriteHorizontal(cantidad, x, y, texture) {
        for (let i = 0; i < cantidad; i++) {
            const sprite = this.borders.create(i * 200 + x, y, texture)
            sprite.body.allowGravity = false
            sprite.body.immovable = true
        }
    }

    rotar(sprite) {
        if (sprite instanceof Plaga) {
            sprite.rotar()
        }
    }

    coger(izq, der) {
        let hembra = izq
        if (!hembra.hembra) {
            hembra = der
        }

        const pareja = izq.hembra !== der.hembra
        if (pareja && !hembra.inicio) {
            hembra.coger()
        }
        return hembra.inicio
    }

    cogiendo(izq, der) {
        let hembra = izq
        if (!hembra.hembra) {
            hembra = der
        }

        if (!hembra.inicio) {
            return
        }
        const macho = hembra.hembra!==izq.hembra?izq:der

        hembra.inicio = false
        hembra.detener()
        macho.detener()
        hembra.x = macho.x
        hembra.y = macho.y        
        macho.setTint(0xff0000)
        
        if (macho.body.angle<0 && hembra.body.angle>0) {
            macho.rotar()
        } else if(hembra.body.angle<0 && macho.body.angle>0){
            hembra.rotar()
        }

        this.tweens.add({
            targets: hembra,
            scaleX: { from: .6, to: 1 },
            scaleY: { from: .6, to: 1 },
            duration: 1000,
            ease: 'Back.out',
            onComplete: () => {
                if (hembra instanceof Plaga || macho instanceof Plaga) {
                    this.dejarCoger(hembra, macho)
                }
            }
        })

    }

    dejarCoger(hembra, macho) {
        if (this.plagaGroup.countActive() < 300) {
            this.plagaGroup.addMultiple(this.createPlagas(2))
        }
        hembra.soltar()
        macho.soltar()
        this.plagaGroup.total++
    }

    activarPotenciador() {
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

    aplicarPotenciador(player, potenciador) {
        if (potenciador instanceof TanqueConAgua) {
            this.tanque.reset()
        } else if (potenciador instanceof Vida) {
            this.player.vida += 2
        }

        this.tweens.add({
            targets: player,
            scaleX: { from: .6, to: 1 },
            scaleY: { from: .6, to: 1 },
            duration: 1000,
            ease: 'Back.out',
        })
        this.barraEstado.actualizar(this.player.vida, this.tanque.capacidad)
        this.potenciadorGroup.remove(potenciador, true, true)
    }

    fumigar() {
        if (this.tanque.estaVacio()) {
            return
        }
        
        const zona = { type: 'edge', source: this.zona, quantity: 42 }
        this.tanque.vaciar()
        this.barraEstado.actualizar(this.player.vida, this.tanque.capacidad)

        const lifespan = (this.tanque.capacidad*1500)/this.tanque.capacidadMax

        this.emitter = this.add.particles(0, 0, 'particle', {
            speed: 24,
            lifespan,
            quantity: 2,
            frequency: 0,
            scale: { start: 0.4, end: 0 },
            emitZone: zona,
            duration: 500,
            emitting: false
        })

        this.emitter.start(2000)
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

    suministrarVida() {
        const x = Math.random() * this.game.config.width
        const y = Math.random() * this.game.config.height
        const potenciador = new Vida(this, new Punto(x, y), "vida")
        this.potenciadorGroup.addPotenciador(potenciador)
        this.time.delayedCall(6000, this.suministrarVida, [], this);
    }

    createTanque() {
        if (this.potenciadorGroup.countActive() > 300) return
        const x = Math.random() * this.game.config.width
        const y = Math.random() * this.game.config.height
        const potenciador = new TanqueConAgua(this, new Punto(x, y), "tanque")
        this.potenciadorGroup.addPotenciador(potenciador)
    }

    update() {
        if (this.gameOver) return

        if (this.plagaGroup.total > 5) {
            this.plagaGroup.total = 0
            this.createTanque()
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

        if (!this.tanque.estaVacio() && this.keys.S.isDown) {
            this.fumigar()
        }

        if (this.emitter) {
            this.plagaGroup.getChildren().forEach(plaga => {
                const plagas = this.emitter.overlap(plaga.body)
                if (plagas.length > 0) {
                    this.plagaGroup.remove(plaga, true, true)
                }
            })
            this.emitter = null
        }

        if (this.plagaGroup.countActive() === 0) {
            this.gameOver = true
            this.reset()
            this.scene.start('GameOver')
        }
    }
}