import { EventBus } from '../EventBus'
import Phaser, { Scene } from 'phaser'
import { Punto } from '../classes/Punto'
import { Tanque } from '../classes/Tanque'
import Player from '../sprites/Player'
import PotenciadorGroup from '../sprites/PotenciadorGroup'
import PlagaGroup from '../sprites/PlagaGroup'
import BarraEstado from '../sprites/BarraEstado'
import TanqueConAgua from '../sprites/TanqueConAgua'
import Vida from '../sprites/Vida'
import BorderSolido from '../sprites/BorderSolido'


export class Game extends Scene {
    constructor() {
        super('Game');
        this.plagaGroup = null;
        this.borders = null;
        this.player = null;
        this.emitter = null;
        this.gameOver = false;
        this.tanque = null;
        this.potenciadorGroup = null;
    }

    create() {
        this.add.image(512, 384, 'background');
        this.physics.world.setBounds(0, 0, 1024, 600);

        this.borders = new BorderSolido(this);

        this.barraEstado = new BarraEstado(this, {
            x: 100,
            y: 30,
            vida: 10,
            capacidad: 10
        });

        this.plagaGroup = new PlagaGroup(this);

        this.potenciadorGroup = new PotenciadorGroup(this);

        this.player = new Player(this, new Punto(100, 100), "player");
        this.tanque = new Tanque();

        this.detectarColision();

        this.time.delayedCall(6000, this.suministrarVida, [], this);

        this.input.mouse.disableContextMenu();

        this.keyboard = this.input.keyboard.createCursorKeys();

        this.keys = this.input.keyboard.addKeys({
            A: Phaser.Input.Keyboard.KeyCodes.A, //Coger el potenciador
            W: Phaser.Input.Keyboard.KeyCodes.W,
            S: Phaser.Input.Keyboard.KeyCodes.S, //fumigar
            D: Phaser.Input.Keyboard.KeyCodes.D
        });

        EventBus.emit('current-scene-ready', this)
    }

    detectarColision() {
        this.physics.add.collider(this.player, this.plagaGroup, this.morir, null, this)
        this.physics.add.collider(this.plagaGroup, this.borders, this.rotar, null, this)
        this.physics.add.collider(this.plagaGroup.getPasivos(), this.plagaGroup.getPasivos(), this.cogiendo, this.coger, this)
        this.physics.add.overlap(this.player, this.potenciadorGroup, this.aplicarPotenciador, this.activarPotenciador, this)
    }

    rotar(sprite) {
        sprite.rotar();
    }

    coger(izq, der) {
        const [hembra, macho] = this.fijarPareja(izq, der);
        const pareja = hembra.hembra && !macho.hembra;
        if (pareja && !hembra.inicio) {
            hembra.coger();
        }
        return hembra.inicio;
    }

    cogiendo(izq, der) {
        const [hembra, macho] = this.fijarPareja(izq, der);
        if (!hembra.inicio) return;
        hembra.cogiendo(macho, this.dejarCoger, this);
    }

    fijarPareja(izq, der) {
        let hembra = izq
        let macho = der
        if (!hembra.hembra) {
            hembra = der
            macho = izq
        }
        return [hembra, macho]
    }

    dejarCoger(hembra, macho) {
        if (this.plagaGroup.countActive() < 300) {
            this.plagaGroup.agregar(this, 2);
        }

        hembra.soltar();
        macho.soltar();
        this.plagaGroup.total++;
    }

    activarPotenciador() {
        if (this.keys.A.isDown) {
            return true
        }
        return false
    }

    aplicarPotenciador(player, potenciador) {
        if (potenciador instanceof TanqueConAgua) {
            this.tanque.reset();
        } else if (potenciador instanceof Vida) {
            this.player.vida += 2;
        }

        this.tweens.add({
            targets: player,
            scaleX: { from: .6, to: 1 },
            scaleY: { from: .6, to: 1 },
            duration: 1000,
            ease: 'Back.out',
        });
        this.barraEstado.actualizar(this.player.vida, this.tanque.capacidad);
        this.potenciadorGroup.remove(potenciador, true, true);
    }

    fumigar() {
        if (this.tanque.estaVacio()) return;
        const zona = { type: 'edge', source: this.player.destino, quantity: 42 };
        this.tanque.vaciar();
        this.barraEstado.actualizar(this.player.vida, this.tanque.capacidad);

        const lifespan = (this.tanque.capacidad * 1500) / this.tanque.capacidadMax;

        this.emitter = this.add.particles(0, 0, 'particle', {
            speed: 24,
            lifespan,
            quantity: 2,
            frequency: 0,
            scale: { start: 0.4, end: 0 },
            emitZone: zona,
            duration: 500,
            emitting: false
        });

        this.emitter.start(2000);
    }

    morir(player, rana) {
        rana.morir()
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
        this.plagaGroup.total = 0
        if (this.potenciadorGroup.countActive() > 500) return
        const x = Math.random() * this.game.config.width
        const y = Math.random() * this.game.config.height
        const potenciador = new TanqueConAgua(this, new Punto(x, y), "tanque")
        this.potenciadorGroup.addPotenciador(potenciador)
    }

    update() {
        if (this.gameOver) return;

        if (this.plagaGroup.total > 5) {
            this.createTanque();
        }

        if (this.keyboard.up.isDown) {
            this.player.top();
        } else if (this.keyboard.right.isDown) {
            this.player.right();
        } else if (this.keyboard.down.isDown) {
            this.player.bottom();
        } else if (this.keyboard.left.isDown) {
            this.player.left();
        }

        if (!this.tanque.estaVacio() && this.keys.S.isDown) {
            this.fumigar();
        }

        if (this.emitter) {
            this.plagaGroup.getChildren().forEach(plaga => {
                const plagas = this.emitter.overlap(plaga.body);
                if (plagas.length > 0) {
                    this.plagaGroup.remove(plaga, true, true);
                }
            });
            this.emitter = null;
        }

        if (this.plagaGroup.estaVacio()) {
            this.gameOver = true;
            this.reset();
            this.scene.start('GameOver');
        }
    }
}