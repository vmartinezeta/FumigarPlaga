import Phaser from "phaser";
import PlagaGroup from "../sprites/PlagaGroup";
import PotenciadorGroup from "../sprites/PotenciadorGroup";
import DockCentro from "../sprites/DockCentro";
import BorderSolido from "../sprites/BorderSolido";
import { Tanque } from "../classes/Tanque";
import Vida from "../sprites/Vida";
import TanqueConAgua from "../sprites/TanqueConAgua";

export class BaseGameScene extends Phaser.Scene {
    constructor(key) {
        super(key);
        this.player = null;
        this.barraEstado = null;
        this.potenciadorGroup = null;
        this.plagaGroup = null;
        this.barraEstado = null;
        this.keyboard = null;
        this.keys = null;
        this.gameOver = false;
    }

    init() {
        this.achievements = {
            firstBlood: {
                unlocked: false,
                text: '¡Primera rana eliminada!',
                score: 0
            },
            score100: {
                unlocked: false,
                text: '¡100 puntos alcanzados!',
                score: 100
            },
            score500: {
                unlocked: false,
                text: '¡500 puntos! Eres un experto',
                score: 500
            },
            nightHunter: {
                unlocked: false,
                text: 'Cazador nocturno desbloqueado',
                score: 300
            }
        };
    }

    checkAchievements() {
        Object.keys(this.achievements).forEach(key => {
            const achievement = this.achievements[key];

            if (!achievement.unlocked && this.score >= achievement.score) {
                this.unlockAchievement(key);
            }
        });
    }

    unlockAchievement(key) {
        this.achievements[key].unlocked = true;

        // Mostrar animación
        const achievementPopup = new Achievement(this, this.achievements[key]);
        achievementPopup.show();

        // Efectos de sonido
        this.sound.play('achievement-sound', { volume: 0.7 });

        // Guardar en localStorage
        this.saveAchievements();
    }

    saveAchievements() {
        const unlocked = {};
        Object.keys(this.achievements).forEach(key => {
            unlocked[key] = this.achievements[key].unlocked;
        });
        localStorage.setItem('gameAchievements', JSON.stringify(unlocked));
    }

    create() {
        this.width = 3584;
        this.height = 600;
        this.bg = this.add.tileSprite(0, 0, this.width, this.height, "bg");
        this.bg.setOrigin(0);
        this.bg.setScrollFactor(0);
        this.frontera = 300;
        this.suelo = this.add.tileSprite(0, this.frontera, this.width, this.frontera, "platform");
        this.suelo.setOrigin(0);
        this.suelo.setScrollFactor(0);

        this.cameras.main.setBounds(0, 0, this.width, this.height);
        this.physics.world.setBounds(0, 0, this.width, this.height);
        this.input.mouse.disableContextMenu();

        this.keyboard = this.input.keyboard.createCursorKeys();

        this.keys = this.input.keyboard.addKeys({
            A: Phaser.Input.Keyboard.KeyCodes.A, //Coger el potenciador
            W: Phaser.Input.Keyboard.KeyCodes.W,
            S: Phaser.Input.Keyboard.KeyCodes.S, //fumigar
            D: Phaser.Input.Keyboard.KeyCodes.D,
            UNO: Phaser.Input.Keyboard.KeyCodes.ONE,
            DOS: Phaser.Input.Keyboard.KeyCodes.TWO,
            TRES: Phaser.Input.Keyboard.KeyCodes.THREE
        });

        this.plagaGroup = new PlagaGroup(this);
        this.potenciadorGroup = new PotenciadorGroup(this);

        this.tanque = new Tanque();

        this.borders = new BorderSolido(this);

        this.time.delayedCall(6000, this.suministrarVida, [], this);

        this.dock = new DockCentro(this);
    }

    changeScene() {
        this.sound.stopAll();
        const record = this.barraEstado?.puntuacion || 0;
        this.scene.start('MainMenu', {
            record
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
            return true;
        }
        return false;
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
        this.barraEstado?.actualizar(this.player.vida, this.tanque.capacidad);

        const factor = this.tanque.capacidad / this.tanque.capacidadMax;
        const frequency = this.player.boquilla.range * (1 - factor);

        const angle = this.getAngle(this.player.control.direccional.angulo, this.player.boquilla.angle);

        this.emitter = this.add.particles(0, 0, 'particle', {
            lifespan: 800,
            speed: this.player.boquilla.rate,
            frequency,
            quantity: 2,
            angle,
            scale: { start: 0.4, end: 0 },
            emitZone: zona,
            duration: 500,
            emitting: false
        });

        this.emitter.start(2000);
    }

    getAngle(ejeRef, angulo) {
        return {
            min: ejeRef - angulo,
            max: ejeRef + angulo
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

    reset() {
        this.gameOver = false;
        this.plagaGroup = null;
        this.player = null;
        this.borders = null;
        this.emitter = null;
        this.zona = null;
    }

    suministrarVida() {
        const x = Math.random() * this.game.config.width;
        const y = Math.random() * this.game.config.height;
        const potenciador = new Vida(this, x, y, "vida");
        this.potenciadorGroup.addPotenciador(potenciador);
        this.time.delayedCall(6000, this.suministrarVida, [], this);
    }

    createTanque() {
        this.plagaGroup.total = 0
        if (this.potenciadorGroup.countActive() > 500) return
        const x = Phaser.Math.Between(100, this.gameWidth - 100);
        const y = Phaser.Math.Between(300, this.game.config.width);
        const potenciador = new TanqueConAgua(this, x, y, "tanque")
        this.potenciadorGroup.addPotenciador(potenciador)
    }

    update() {
        this.player.update();
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
        } else if (this.keys.TRES.isDown) {
            this.player.setBoquilla(new BujillaAvanico());
            this.barraEstado.setBoquilla(3);
            this.dock.updateDock(3);
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