import Phaser from "phaser";
import DockCentro from "../sprites/DockCentro";
import SueloFrontera from "../sprites/SueloFrontera";
import PlagaGroup from "../sprites/Enemigos/PlagaGroup";
import Rana from "../sprites/Enemigos/Rana";
import Honda from "../sprites/KitFierro/Honda";
import BujillaChorrito from "../sprites/KitFierro/BujillaChorrito";
import BujillaAvanico from "../sprites/KitFierro/BujillaAvanico";
import PotenciadorGroup from "../sprites/Potenciadores/PotenciadorGroup";
import Vida from "../sprites/Potenciadores/Vida";
import TanqueConAgua from "../sprites/Potenciadores/TanqueConAgua";
import FuriaDude from "../sprites/Potenciadores/FuriaDude";
import LanzaLlamas from "../sprites/KitFierro/LanzaLlamas";
import LanzaHumo from "../sprites/KitFierro/LanzaHumo";


export class BaseGameScene extends Phaser.Scene {
    constructor(key) {
        super(key);
        this.player = null;
        this.barraEstado = null;
        this.potenciadorGroup = null;
        this.plagaGroup = null;
        this.mosquitos = null;
        this.keyboard = null;
        this.gameOver = false;
        this.spray = null;
        this.ymax = 300;
        this.width = 0;
        this.height = 0;
        this.sueloFrontera = null;
        this.pinchos = null;
        this.emitter = null;
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
        this.width = 4 * this.game.config.width;
        this.height = this.game.config.height;
        this.bg = this.add.tileSprite(0, 0, this.width, this.height, "bg");
        this.bg.setOrigin(0);
        this.bg.setScrollFactor(0);
        this.ymax = 300;
        this.add.tileSprite(0, this.ymax, this.width, this.ymax, "platform")
            .setOrigin(0)
            .setScrollFactor(0);


        this.cameras.main.setBounds(0, 0, this.width, this.ymax);
        this.physics.world.setBounds(0, this.ymax, this.width, this.ymax);
        this.input.mouse.disableContextMenu();

        this.keyboard = this.input.keyboard.addKeys({
            A: Phaser.Input.Keyboard.KeyCodes.A, //Coger el potenciador
            W: Phaser.Input.Keyboard.KeyCodes.W,
            S: Phaser.Input.Keyboard.KeyCodes.S, //fumigar
            D: Phaser.Input.Keyboard.KeyCodes.D,
            UP: Phaser.Input.Keyboard.KeyCodes.UP,
            RIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            DOWN: Phaser.Input.Keyboard.KeyCodes.DOWN,
            LEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
            UNO: Phaser.Input.Keyboard.KeyCodes.ONE,
            DOS: Phaser.Input.Keyboard.KeyCodes.TWO,
            TRES: Phaser.Input.Keyboard.KeyCodes.THREE,
            _BARRA: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        this.plagaGroup = new PlagaGroup(this, 0, this.ymax);

        this.potenciadorGroup = new PotenciadorGroup(this);

        this.sueloFrontera = new SueloFrontera(this, 0, this.ymax+40);

        this.time.addEvent({
            delay: 6000,
            callback: this.suministrarPotenciador,
            callbackScope: this,
            loop: true
        });

        this.dock = new DockCentro(this);

        this.emitter = this.add.particles(0,0, 'particle', {
            speed: 100,
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 1000,
            quantity: 2,
            emitting: false
        });

        this.scream = this.sound.add('scream', {
            volume: 0.4
        });
    }

    changeScene() {
        this.sound.stopAll();
        const record = this.barraEstado?.puntuacion || 0;
        this.scene.start('MainMenu', {
            record
        });
    }

    activarColisiones() {
        this.physics.add.collider(this.player, this.plagaGroup, this.morir, null, this);
        this.physics.add.collider(this.player, this.pinchos, this.morirPlayer, null, this);
        this.physics.add.overlap(this.spray, this.plagaGroup, this.handleParticleCollision, null, this);
        this.physics.add.collider(this.plagaGroup, this.sueloFrontera, this.rotar, null, this);
        this.physics.add.collider(this.plagaGroup, this.plagaGroup, this.cogiendo, this.coger, this);
        this.physics.add.overlap(this.player, this.potenciadorGroup, this.aplicarPotenciador, this.activarPotenciador, this);
        this.physics.add.collider(this.player, this.sueloFrontera);
        this.physics.add.collider(this.mosquitos, this.bosqueFrontera);
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
        if (this.keyboard.A.isDown) {
            return true;
        }
        return false;
    }

    aplicarPotenciador(player, potenciador) {
        if (potenciador instanceof TanqueConAgua) {
            potenciador.applyEffect(this.spray);
        } else if (potenciador instanceof Vida) {
            potenciador.applyEffect(player);
        } else if(potenciador instanceof FuriaDude) {
            player.activarFuria();
            this.emitter.start();
            this.emitter.startFollow(this.player);
            this.time.delayedCall(10000, () => {
                this.emitter.destroy();
                this.player.reset();
            });
        }

        this.tweens.add({
            targets: player,
            scaleX: { from: .6, to: 1 },
            scaleY: { from: .6, to: 1 },
            duration: 1000,
            ease: 'Back.out',
        });
        this.barraEstado.actualizar(this.player.vida, this.spray.iterationCount);
        this.potenciadorGroup.remove(potenciador, true, true);
    }

    createParticle(x, y) {
        const particle = this.fluidParticles.create(x, y, 'particle')
            .setScale(0.3)
            .setAlpha(1)
            .setBounce(0.2, 0.2)
            .setDrag(10, 10).setTint(0x000000);

        // Velocidad inicial
        const speed = 300;
        const angle = this.player.control.right() ? 20 : 160; // Dirección según player

        particle.setVelocity(
            Math.cos(Phaser.Math.DegToRad(angle)) * speed,
            Math.sin(Phaser.Math.DegToRad(angle)) * speed
        );

        // Autodestrucción después de tiempo
        this.time.delayedCall(2000, () => {
            if (particle.active) particle.destroy();
        });

        return particle;
    }

    fijarObjetivo(izq, der) {
        let rana = izq
        let particula = der;
        if (der instanceof Rana) {
            rana = der;
            particula = izq;
        }
        return [particula, rana];
    }

    handleParticleCollision(particle, frog) {
        const [particula, rana] = this.fijarObjetivo(particle, frog);
        particula.destroy();
        rana.takeDamage(this.spray.damage);
        if (rana.debeMorir()) {
            this.barraEstado.setPuntuacion(rana.vidaMax);
            rana.morir();
        }

        rana.setTint(0xff0000);
        this.time.delayedCall(100, () => rana.clearTint());
        this.createSplashEffect(rana.x, rana.y);
    }

    createSplashEffect(x, y) {
        // Partículas de salpicadura
        const splash = this.add.particles(x, y, 'particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 600,
            quantity: 3,
            emitting: false
        });

        splash.explode(3);
        this.time.delayedCall(700, () => splash.destroy());
    }

    morirPlayer(player, pincho) {
        pincho.destroy();
        player.takeDamage();
        this.scream.play();
        this.barraEstado.actualizar(player.vida, this.spray.iterationCount);
        if (player.debeMorir()) {
            this.scene.start('GameOver');
        }
    }

    morir(player, rana) {
        player.takeDamage();
        if (rana instanceof Rana) {
            this.barraEstado.setPuntuacion(rana.vidaMax);
            rana.morir();
        }

        this.barraEstado.actualizar(player.vida, this.spray.iterationCount);
        if (player.debeMorir()) {
            this.scene.start('GameOver');
        }
    }

    reset() {
        this.width = 0;
        this.height = 0;
        this.ymax = 300;
        this.gameOver = false;
        this.player = null;
        this.keyboard = null;
        this.barraEstado = null;
        this.potenciadorGroup = null;
        this.spray = null;
        this.plagaGroup = null;
        this.pinchos = null;
        this.mosquitos = null;
        this.sueloFrontera = null;
    }

    suministrarPotenciador() {
        const x = Phaser.Math.Between(100, this.width - 100);
        const y = Phaser.Math.Between(100, this.ymax - 100);
        const value = Phaser.Math.Between(1, 2);
        let potenciador = null;
        if (value === 1) {
            potenciador = new Vida(this, x, y, "vida");
        } else {
            potenciador = new FuriaDude(this, x, y, "furia");
        }
        this.potenciadorGroup.addPotenciador(potenciador);
    }

    createTanque() {
        this.plagaGroup.total = 0
        if (this.potenciadorGroup.countActive() > 500) return
        const x = Phaser.Math.Between(100, this.width - 100);
        const y = Phaser.Math.Between(300, this.height);
        const potenciador = new TanqueConAgua(this, x, y, "tanque");
        this.potenciadorGroup.addPotenciador(potenciador);
    }

    update() {
        this.player.update();
        this.plagaGroup.update();

        if (this.plagaGroup.total > 5) {
            this.createTanque();
        }

        if (this.keyboard.UP.isDown) {
            this.player.top();
        } else if (this.keyboard.RIGHT.isDown) {
            this.player.right();
        } else if (this.keyboard.DOWN.isDown) {
            this.player.bottom();
        } else if (this.keyboard.LEFT.isDown) {
            this.player.left();
        }

        if (this.keyboard._BARRA.isDown) {
            this.player.setTint(0xff0000)
            this.player.saltar();
        }

        if (this.keyboard.UNO.isDown) {
            this.spray = new Honda(this, this.player);
            this.barraEstado.setBoquilla(1);
            this.dock.updateDock(1);
        } else if (this.keyboard.DOS.isDown) {
            this.spray = new BujillaChorrito(this, this.player);
            this.barraEstado.setBoquilla(2);
            this.dock.updateDock(2);
        } else if (this.keyboard.TRES.isDown) {
            this.spray = new BujillaAvanico(this, this.player);
            this.barraEstado.setBoquilla(3);
            this.dock.updateDock(3);
        } 

        if (this.spray instanceof Honda && !this.spray.estaFuera && this.keyboard.S.isDown) {
            this.spray.lanzar();
            this.barraEstado.actualizar(this.player.vida, this.spray.iterationCount);
        } else if (this.spray instanceof Honda && this.spray.estaFuera && this.keyboard.S.isUp) {
            this.spray.soltar();
        } else if ([BujillaChorrito, BujillaAvanico, LanzaLlamas, LanzaHumo].some(base => this.spray instanceof base) && this.keyboard.S.isDown) {
            this.spray.abrir();
        }


        if (this.plagaGroup.estaVacio()) {
            this.gameOver = true;
            this.reset();
            this.scene.start('GameOver');
        }
    }

}