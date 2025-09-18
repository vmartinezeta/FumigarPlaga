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
import DockCentro from '../sprites/DockCentro'
import BorderSolido from '../sprites/BorderSolido'
import { BujillaLinear } from '../classes/BujillaLinear'
import { BujillaRadial } from '../classes/BujillaRadial'


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
        this.dock = null;
        this.gameWidth = 4000;
        this.gameHeight = 600;
    }

    create() {
        const width = 3584;
        const height = 600;
        this.bg = this.add.tileSprite(0, 0, width, height, "bg");
        this.bg.setOrigin(0);
        this.bg.setScrollFactor(0);
        this.frontera = 300;
        this.suelo = this.add.tileSprite(0, this.frontera, width, this.frontera, "platform");
        this.suelo.setOrigin(0);
        this.bg.setScrollFactor(0);

        this.bosque = this.add.tileSprite(0, 256, width, 200, "bosque");
        this.bosque.setOrigin(1/2);
        this.bosque.setScale(.6)
        this.bosque.setScrollFactor(0);

        this.cloudTextures = ["nube", "nube-2"];

        this.clouds = this.add.tileSprite(0, 100, 6000, 200, this.cloudTextures[0]);
        this.clouds.setScrollFactor(.5);
        this.clouds.setAlpha(.9);
        this.clouds.setScale(.8);

        this.nextClouds = this.add.tileSprite(0, 100, 6000, 200, this.cloudTextures[1]);
        this.nextClouds.setScrollFactor(.5);
        this.nextClouds.setAlpha(0);
        this.nextClouds.setScale(.8);

        // Timer para cambiar texturas
        this.textureTimer = this.time.addEvent({
            delay: 10000,
            callback: this.smoothTextureTransition,
            callbackScope: this,
            loop: true
        });

        this.textureIndex = 0;

        // this.time.addEvent({
        //     delay: 5000,
        //     callback: this.randomizeTilePosition,
        //     callbackScope: this,
        //     loop: true
        // });

        this.cameras.main.setBounds(0, 0, width, height);
        this.physics.world.setBounds(0, 0, width, height);


        this.barraEstado = new BarraEstado(this, {
            x: 100,
            y: 30,
            vida: 10,
            capacidad: 10,
            boquilla: 1
        });

        this.plagaGroup = new PlagaGroup(this);

        this.potenciadorGroup = new PotenciadorGroup(this);

        this.player = new Player(this, 100, 560, "player");
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.tanque = new Tanque();

        this.borders = new BorderSolido(this);

        this.detectarColision();

        this.time.delayedCall(6000, this.suministrarVida, [], this);

        this.dock = new DockCentro(this);

        this.input.mouse.disableContextMenu();

        this.keyboard = this.input.keyboard.createCursorKeys();

        this.keys = this.input.keyboard.addKeys({
            A: Phaser.Input.Keyboard.KeyCodes.A, //Coger el potenciador
            W: Phaser.Input.Keyboard.KeyCodes.W,
            S: Phaser.Input.Keyboard.KeyCodes.S, //fumigar
            D: Phaser.Input.Keyboard.KeyCodes.D,
            UNO: Phaser.Input.Keyboard.KeyCodes.ONE,
            DOS: Phaser.Input.Keyboard.KeyCodes.TWO
        });

        EventBus.emit('current-scene-ready', this);
    }

    smoothTextureTransition() {
        // 1. Preparar siguiente textura
        this.textureIndex = (this.textureIndex + 1) % this.cloudTextures.length;
        this.nextClouds.setTexture(this.cloudTextures[this.textureIndex]);

        // 2. Animación de crossfade (3 segundos)
        this.tweens.add({
            targets: this.clouds,
            alpha: 0,
            duration: 3000,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: this.nextClouds,
            alpha: 1,
            duration: 3000,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                // 3. Intercambiar roles
                const temp = this.clouds;
                this.clouds = this.nextClouds;
                this.nextClouds = temp;
                this.nextClouds.setAlpha(0);
            }
        });
    }

    rotateCloudTexture() {
        // Avanzar al siguiente índice (circular)
        this.currentTextureIndex = (this.currentTextureIndex + 1) % this.cloudTextures.length;

        // Obtener nueva textura
        const newTexture = this.cloudTextures[this.currentTextureIndex];

        // ¡Aquí está la magia! Cambiar la textura
        this.clouds.setTexture(newTexture);

        // Efecto visual suave de transición
        this.animateTextureChange();
    }

    animateTextureChange() {
        // Efecto de fade in/out para suavizar el cambio
        this.tweens.add({
            targets: this.clouds,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            onComplete: () => {
                this.clouds.alpha = 1;
            }
        });
    }

    randomizeTilePosition() {
        // Saltar a una posición aleatoria del tileSprite
        this.nube.tilePositionX = Phaser.Math.Between(0, 4000);

        // Ocultar brevemente para disimular el "salto"
        this.tweens.add({
            targets: this.nube,
            alpha: 0.3,
            duration: 200,
            yoyo: true
        });
    }

    detectarColision() {
        this.physics.add.collider(this.player, this.plagaGroup, this.morir, null, this);
        this.physics.add.collider(this.plagaGroup, this.borders, this.rotar, null, this);
        this.physics.add.collider(this.player, this.borders);
        this.physics.add.collider(this.plagaGroup, this.plagaGroup, this.cogiendo, this.coger, this);
        this.physics.add.overlap(this.player, this.potenciadorGroup, this.aplicarPotenciador, this.activarPotenciador, this);
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
        hembra.cogiendo(macho, "rana2", this.dejarCoger, this);
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
        if (!hembra.body || !macho.body) return;
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

        const factor = this.tanque.capacidad / this.tanque.capacidadMax;
        const frequency = this.player.boquilla.range * (1 - factor);
        const angle = this.getAngle();

        this.emitter = this.add.particles(0, 0, 'particle', {
            lifespan: 800,
            speed: this.player.boquilla.rate,
            frequency,
            quantity: 2,
            angle,
            scale: { start: 0.4, end: 0 },
            // alpha: { start: 1, end: 0.3 },
            // Trayectoria curvada (efecto arco)
            // blendMode: 'SCREEN',
            // gravityY:300,
            // moveToX: Phaser.Math.Between(-20, 20),
            // moveToY: Phaser.Math.Between(-50, -20),
            emitZone: zona,
            duration: 500,
            emitting: false
        });

        this.emitter.start(2000);
    }

    deltaTheta(ejeRef, angulo) {
        return {
            min: ejeRef - angulo,
            max: ejeRef + angulo
        }
    }

    getAngle() {
        const angulo = this.player.boquilla.angle;
        if (this.player.control.top()) {
            return this.deltaTheta(270, angulo);
        } else if (this.player.control.right()) {
            return this.deltaTheta(0, angulo);
        } else if (this.player.control.bottom()) {
            return this.deltaTheta(90, angulo);
        } else if (this.player.control.left()) {
            return this.deltaTheta(180, angulo);
        }
    }

    morir(player, rana) {
        this.barraEstado.setPuntuacion(rana.vidaMax);
        rana.morir();
        player.vida--;

        this.barraEstado.actualizar(player.vida, this.tanque.capacidad);
        if (player.vida === 0) {
            this.scene.start('GameOver');
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
        const x = Phaser.Math.Between(100, this.gameWidth - 100);
        const y = this.gameHeight - 200;
        const potenciador = new TanqueConAgua(this, new Punto(x, y), "tanque")
        this.potenciadorGroup.addPotenciador(potenciador)
    }

    update() {
        if (this.gameOver) return;
        this.clouds.tilePositionX += .2;


        this.player.permanecerAbajo(this.frontera);
        this.plagaGroup.update();

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

        if (this.keys.UNO.isDown) {
            this.player.setBoquilla(new BujillaLinear());
            this.barraEstado.setBoquilla(1);
            this.dock.updateDock(1);
        } else if (this.keys.DOS.isDown) {
            this.player.setBoquilla(new BujillaRadial());
            this.barraEstado.setBoquilla(2);
            this.dock.updateDock(2);
        }

        if (!this.tanque.estaVacio() && this.keys.S.isDown) {
            this.fumigar();
        }

        if (this.emitter) {

            this.plagaGroup.getChildren().forEach(plaga => {
                const particulas = this.emitter.overlap(plaga.body);

                const damage = this.player.boquilla.damage * particulas.length;
                for (const p of particulas) p.kill();
                plaga.takeDamage(damage);

                if (plaga.vida <= 0) {
                    this.barraEstado.setPuntuacion(plaga.vidaMax);
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