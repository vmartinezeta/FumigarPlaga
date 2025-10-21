import Phaser from "phaser";
import SueloFrontera from "../sprites/SueloFrontera";
import PlagaGroup from "../sprites/Enemigos/PlagaGroup";
import PotenciadorGroup from "../sprites/Potenciadores/PotenciadorGroup";
import Honda from "../sprites/KitFierro/Honda";
import LanzaLlamas from "../sprites/KitFierro/LanzaLlamas";
import LanzaHumo from "../sprites/KitFierro/LanzaHumo";
import UIManager from "../sprites/UIManager";
import DockCenter from "../sprites/DockCenter";
import RanaStaticFamily from "../sprites/Potenciadores/RanaStaticFamily";
import RanaMovableFamily from "../sprites/Potenciadores/RanaMovableFamily";
import Achievement from "../sprites/Achivements/Achievement";
import Invencibility from "../sprites/Potenciadores/Invencibility";
import RecargaFierro from "../sprites/Potenciadores/RecargaFierro";
import FuriaDude from "../sprites/Potenciadores/FuriaDude";
import Vida from "../sprites/Potenciadores/Vida";
import Honda3Impacto from "../sprites/KitFierro/Honda3Impacto";
import PowerUpFactory from "../sprites/Potenciadores/PowerUpFactory";



export class BaseGameScene extends Phaser.Scene {
    constructor(key) {
        super(key);
        this.player = null;
        this.statusBar = null;
        this.potenciadorGroup = null;
        this.plagaGroup = null;
        this.mosquitos = null;
        this.keyboard = null;
        this.ymax = 300;
        this.width = 0;
        this.height = 0;
        this.sueloFrontera = null;
        this.pinchos = null;
        this.eventBus = null;
        this.difficultyLevel = 1;
        this.achievements = [
            {
                key: "firstBlood",
                unlocked: false,
                text: '¡Primera rana eliminada!',
                score: 30
            },
            {
                key: "nightHunter",
                unlocked: false,
                text: '¡100 puntos alcanzados!',
                score: 100
            },
            {
                key: "score100",
                unlocked: false,
                text: '¡500 puntos! Eres un experto',
                score: 500
            },
            {
                key: "score500",
                unlocked: false,
                text: 'Cazador nocturno desbloqueado',
                score: 300
            },
            {
                key: "firstPowerUp",
                unlocked: false,
                text: 'Primer Potenciador usado'
            },
            {
                key: "DoublePowerUp",
                unlocked: false,
                text: 'Doble potenciador al instante'
            },
        ];

        this.gameTime = 0; // Tiempo de juego en segundos
        this.maxFrogs = 50; // Límite absoluto de ranas
        this.baseThreshold = 50; // Umbral base de distancia para apareamiento
        this.timeThreshold = 0; // Incremento del umbral con el tiempo
        this.breedingCooldown = 5000; // Tiempo en ms entre apareamientos por rana
        this.lastBreedTime = {}; // Diccionario para guardar el último tiempo de apareamiento de cada rana
        this.totalRanas = 600;
    }

    init() {
        const logros = JSON.parse(localStorage.getItem('gameAchievements') || "[]");
        if (logros.length) {
            logros.forEach(logro => {
                const oldLogro = this.achievements.find(l => l.key === logro.key);
                oldLogro.unlocked = logro.unlocked;
            });
        }
    }

    checkAchievements() {
        if (!this.statusBar) return;
        this.achievements.forEach(achievement => {
            if (!achievement.unlocked && this.statusBar.puntuacion >= achievement.score) {
                this.unlockAchievement(achievement);
            }
        });
    }

    unlockAchievement(achievement) {
        achievement.unlocked = true;

        // Mostrar animación
        const achievementPopup = new Achievement(this, this.game.config.width / 2, -100, achievement);
        achievementPopup.show();

        // Efectos de sonido
        this.sound.play('logro', { volume: 0.7 });

        // Guardar en localStorage
        this.saveAchievements();
    }

    saveAchievements() {
        localStorage.setItem('gameAchievements', JSON.stringify(this.achievements));
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
        this.eventBus = new Phaser.Events.EventEmitter();

        this.plagaGroup = new PlagaGroup(this, this.eventBus, 0, this.ymax);

        this.potenciadorGroup = this.physics.add.group();

        this.sueloFrontera = new SueloFrontera(this, 0, this.ymax + 40);

        this.time.addEvent({
            delay: 6000,
            callback: this.suministrarPotenciador,
            callbackScope: this,
            loop: true
        });

        this.staticFamilies = [];
        this.movableFamilies = [];
        this.time.addEvent({
            delay: 1000, // cada 10 segundos intenta generar
            callback: this.spawnStaticFamily,
            callbackScope: this,
            loop: true
        });

        this.dock = new DockCenter(this);

        this.scream = this.sound.add('scream', {
            volume: 0.4
        });

        this.uiManager = new UIManager(this, this.eventBus);

        this.fierro = new Honda3Impacto(this);

        this.eventBus.on("familyDestroyed", ({ familyType }) => {
            this.physics.world.removeCollider(familyType.collider);
            this.statusBar.setConfig({ puntuacion: familyType.ranaCount * 30 });
        });
    }

    spawnStaticFamily() {
        if (this.plagaGroup.countActive()> this.totalRanas) return;
        const x = Phaser.Math.Between(100, this.width - 100);
        const y = Phaser.Math.Between(this.ymax + 20, this.height - 20);
        const ranaCount = Phaser.Math.Between(5, 8); // 5-8 ranas
        const radius = Phaser.Math.Between(20, 30);

        const family = new RanaStaticFamily(this, x, y, ranaCount, radius);
        this.plagaGroup.add(family);
    }

    spawnMovableFamily() {
        const x = Phaser.Math.Between(100, this.width - 100);
        const y = Phaser.Math.Between(this.ymax + 20, this.height - 20);
        const ranaCount = Phaser.Math.Between(5, 7); // 5-7 ranas (más difíciles)
        const radius = Phaser.Math.Between(70, 110);
        const movementRadius = Phaser.Math.Between(100, 150);

        const family = new RanaMovableFamily(this, x, y, ranaCount, radius, movementRadius);
        this.movableFamilies.push(family);

        return family;
    }

    getSafeSpawnPosition() {
        // Buscar posición lejos del jugador
        const margin = 150;
        let x, y;
        let attempts = 0;

        do {
            x = Phaser.Math.Between(margin, this.game.config.width - margin);
            y = Phaser.Math.Between(margin, this.game.config.height - margin);
            attempts++;
        } while (
            Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y) < 200
            && attempts < 10
        );

        return { x, y };
    }

    setupFamilyEvents() {
        // Escuchar eventos de familias destruidas
        this.eventBus.on('familyDestroyed', this.onFamilyDestroyed, this);
    }

    onFamilyDestroyed(data) {
        console.log(`🎊 Familia ${data.familyType} destruida! Potenciador: ${data.powerupType}`);

        // Remover familia de los arrays
        if (data.familyType === 'static') {
            this.staticFamilies = this.staticFamilies.filter(f => f.isAlive);
        } else {
            this.movableFamilies = this.movableFamilies.filter(f => f.isAlive);
        }

        // Bonus de puntos por destruir familia completa
        this.scoreManager.addScore(500, `familia_${data.familyType}`);
    }

    changeScene() {
        this.sound.stopAll();
        const record = this.statusBar?.puntuacion || 0;
        this.scene.start('MainMenu', {
            record
        });
    }

    activarColisiones() {
        this.physics.add.collider(this.player, this.plagaGroup, this.morir, null, this);
        this.physics.add.collider(this.player, this.pinchos, this.morirPlayer, null, this);
        this.physics.add.collider(this.plagaGroup, this.sueloFrontera, this.rotar, null, this);
        // this.physics.add.collider(this.plagaGroup, this.plagaGroup, this.cogiendo, this.coger, this);
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
        this.plagaGroup.agregar(this, 2);
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
        if (potenciador instanceof RecargaFierro) {
            potenciador.applyEffect(this.fierro);
            this.eventBus.emit("capacityWeaponChanged", { capacidad: this.fierro.capacidad })
            this.potenciadorGroup.remove(potenciador, true, true);
        } else if (potenciador instanceof Vida) {
            potenciador.applyEffect(player);
        } else if (potenciador instanceof FuriaDude || potenciador instanceof Invencibility) {
            this.eventBus.emit('furiaActivated', { player, potenciador });
        }
    }

    morirPlayer(player, pincho) {
        pincho.destroy();
        if (!player.tieneFuria) {
            this.scream.play();
        }
        this.eventBus.emit("playerHealthChanged", { player });
    }

    morir(player, rana) {
        rana.morir();
        this.eventBus.emit("playerHealthChanged", { player });
        this.eventBus.emit("scoreChanged", { puntuacion: rana.vidaMax });
    }

    reset() {
        this.width = 0;
        this.height = 0;
        this.ymax = 300;
        this.gameOver = false;
        this.player = null;
        this.keyboard = null;
        this.statusBar = null;
        this.potenciadorGroup = null;
        this.spray = null;
        this.plagaGroup = null;
        this.pinchos = null;
        this.mosquitos = null;
        this.sueloFrontera = null;
    }

    suministrarPotenciador() {
        const x = Phaser.Math.Between(100, this.width - 100);
        const y = Phaser.Math.Between(400, this.height - 100);
        const potenciador = PowerUpFactory.createRandomPowerUp(this, x, y);
        console.log(potenciador);
        this.potenciadorGroup.add(potenciador);
    }

    createTanque() {
        this.plagaGroup.total = 0
        if (this.potenciadorGroup.countActive() > 500) return
        const x = Phaser.Math.Between(100, this.width - 100);
        const y = Phaser.Math.Between(350, this.height - 50);
        const potenciador = PowerUpFactory.createPowerUp("recarga-fierro", this, x, y);
        this.potenciadorGroup.add(potenciador);
    }

    update() {
        this.checkAchievements();
        this.player.update();
        this.plagaGroup.update();

        // if (this.plagaGroup.total > 5) {
        //     this.createTanque();
        // }

        if (this.keyboard.UP.isDown) {
            this.player.top();
        } else if (this.keyboard.RIGHT.isDown) {
            this.player.right();
        } else if (this.keyboard.DOWN.isDown) {
            this.player.bottom();
        } else if (this.keyboard.LEFT.isDown) {
            this.player.left();
        }


        if (this.keyboard.UNO.isDown) {
            this.updateHonda();
        } else if (this.keyboard.DOS.isDown) {
            this.updateLanzaLlamas();
        } else if (this.keyboard.TRES.isDown) {
            this.updateLanzaHumo();
        }

        if (this.fierro instanceof Honda && this.keyboard.S.isDown) {
            this.player.disparar(this.fierro, this.plagaGroup);
            this.statusBar.setConfig({ capacidad: this.fierro.capacidad })
        } else if (this.fierro instanceof LanzaLlamas && this.keyboard.S.isDown) {
            this.player.disparar(this.fierro, this.plagaGroup);
            this.statusBar.setConfig({ capacidad: this.fierro.capacidad })
        } else if (this.fierro instanceof LanzaHumo && this.keyboard.S.isDown) {
            this.player.disparar(this.fierro, this.plagaGroup);
            this.statusBar.setConfig({ capacidad: this.fierro.capacidad })
        } else if (this.fierro instanceof Honda3Impacto && this.keyboard.S.isDown) {
            this.player.disparar(this.fierro, this.plagaGroup);
        }

        if (this.plagaGroup.estaVacio()) {
            this.uiManager.gameOver = true;
            this.reset();
        }
        
    }

    breedFrogs(threshold) {
        let frogsArray = this.plagaGroup.getChildren();
        let currentTime = this.gameTime * 1000; // Convertir a ms

        for (let i = 0; i < frogsArray.length; i++) {
            let frog1 = frogsArray[i];
            for (let j = i + 1; j < frogsArray.length; j++) {
                let frog2 = frogsArray[j];

                // Calcular distancia entre frog1 y frog2
                let distance = Phaser.Math.Distance.Between(frog1.x, frog1.y, frog2.x, frog2.y);
                if (distance < threshold) {
                    // Verificar cooldown para frog1 y frog2
                    if (this.canBreed(frog1, currentTime) && this.canBreed(frog2, currentTime)) {
                        this.createNewFrog(frog1, frog2);
                        this.lastBreedTime[frog1.id] = currentTime;
                        this.lastBreedTime[frog2.id] = currentTime;
                        break; // Evitar múltiples apareamientos para la misma rana en un mismo frame
                    }
                }
            }
        }
    }

    canBreed(frog, currentTime) {
        // Si no ha criado antes, puede criar. O si ha pasado el cooldown.
        if (!this.lastBreedTime[frog.id]) {
            return true;
        }
        return (currentTime - this.lastBreedTime[frog.id]) > this.breedingCooldown;
    }

    createNewFrog(frog1, frog2) {
        if (this.plagaGroup.countActive() > this.totalRanas) return;
        frog1.cogiendo(frog2, "rana2", this.dejarCoger, this);
    }

    updateDifficulty() {
        // Ajustar la dificultad en función del tiempo
        // Por ejemplo, cada 60 segundos aumenta la dificultad
        this.difficultyLevel = 1 + Math.floor(this.gameTime / 60);
    }

    updateHonda() {
        this.fierro = new Honda(this);
        this.statusBar.setConfig({ fierro: 1 });
        this.dock.updateDock(1);
    }

    updateLanzaLlamas() {
        this.fierro = new LanzaLlamas(this);
        this.statusBar.setConfig({ fierro: 2 });
        this.dock.updateDock(2);
    }

    updateLanzaHumo() {
        this.fierro = new LanzaHumo(this);
        this.statusBar.setConfig({ fierro: 3 });
        this.dock.updateDock(3);
    }

}