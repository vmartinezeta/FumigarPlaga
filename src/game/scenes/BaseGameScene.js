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
import MultiShoot from "../sprites/Potenciadores/MultiShot";
import Bomba from "../sprites/KitFierro/Bomba";
import WeaponManager from "../sprites/KitFierro/WeaponManager";
import WaterPoolManager from "../sprites/WaterPoolManager";


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
        this.fierros = [];
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

        this.fierros = [
            new Honda(this),
            new Bomba(this),
            new LanzaLlamas(this),
            new LanzaHumo(this)
        ];

        this.plagaGroup = new PlagaGroup(this, this.eventBus, 0, this.ymax);

        this.potenciadorGroup = this.physics.add.group();

        this.sueloFrontera = new SueloFrontera(this, 0, this.ymax + 40);

        this.time.addEvent({
            delay: 3000,
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

        this.fierro = this.fierros[0];

        this.eventBus.on("familyDestroyed", ({ familyType }) => {
            this.physics.world.removeCollider(familyType.collider);
            this.statusBar.setConfig({ puntuacion: familyType.ranaCount * 30 });
        });


        this.weaponManager = new WeaponManager(this);
        this.setupWeaponControls();
    }

    setupWeaponControls() {
        // Teclas 1, 2, 3 para cambiar a arma específica
        this.input.keyboard.on('keydown-ONE', () => {
            this.weaponManager.equipWeapon(0);
            this.dock.updateDock(1);
        });
        this.input.keyboard.on('keydown-TWO', () => {
            this.weaponManager.equipWeapon(1);
            this.dock.updateDock(2);
        });
        this.input.keyboard.on('keydown-THREE', () => {
            this.weaponManager.equipWeapon(2);
            this.dock.updateDock(3);
        });

        this.input.keyboard.on('keydown-FOUR', () => {
            this.weaponManager.equipWeapon(3);            
        });

        // Rueda del mouse
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            if (deltaY > 0) {
                this.weaponManager.switchToPreviousWeapon();
            } else {
                this.weaponManager.switchToNextWeapon();
            }
        });

        // Disparar con clic o barra espaciadora
        this.input.on('pointerdown', () => {
            this.weaponManager.shoot(this.player.control, this.player.x, this.player.y, this.plagaGroup);
        });

        this.input.keyboard.on('keydown-SPACE', () => {
            this.weaponManager.shoot(this.player.control, this.player.x, this.player.y, this.plagaGroup);
            this.statusBar.setConfig({capacidad: this.weaponManager.getCurrentWeapon().capacidad});
        });

        this.waterPoolManager = new WaterPoolManager(this);
    }

    spawnStaticFamily() {
        if (this.plagaGroup.countActive() > this.totalRanas) return;
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
        this.physics.add.overlap(this.player, this.potenciadorGroup, this.aplicarPotenciador, this.activarPotenciador, this);
        // this.physics.add.collider(this.player, this.sueloFrontera);        
        // this.physics.add.collider(this.mosquitos, this.bosqueFrontera);
    }

    activarPotenciador() {
        if (this.keyboard.A.isDown) {
            return true;
        }
        return false;
    }

    aplicarPotenciador(player, potenciador) {
        if (potenciador instanceof RecargaFierro) {
            const weapon = this.weaponManager.getCurrentWeapon();
            potenciador.applyEffect(weapon);
            this.eventBus.emit("capacityWeaponChanged", { capacidad: weapon.capacidad });
            this.potenciadorGroup.remove(potenciador, true, true);
        } else if (potenciador instanceof Vida) {
            potenciador.applyEffect(player);
            this.statusBar.setConfig({ vida: player.vida });
            this.potenciadorGroup.remove(potenciador, true, true);
        } else if (potenciador instanceof FuriaDude || potenciador instanceof Invencibility) {
            this.eventBus.emit('furiaActivated', { player, potenciador });
            this.potenciadorGroup.remove(potenciador, true, true);
        } else if (potenciador instanceof MultiShoot) {
            this.fierros[0] = potenciador.honda;
            this.fierro = this.fierros[0];
            potenciador.onEliminar();
            this.potenciadorGroup.remove(potenciador, true, true);
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
        this.width = 4 * this.game.config.width;
        this.height = this.game.config.height;
        this.ymax = 300;
        this.uiManager = null;
        this.player = null;
        this.keyboard = null;
        this.statusBar = null;
        this.potenciadorGroup = null;
        this.plagaGroup = null;
        this.pinchos = null;
        this.mosquitos = null;
        this.sueloFrontera = null;
    }

    suministrarPotenciador() {
        const x = Phaser.Math.Between(100, this.width - 100);
        const y = Phaser.Math.Between(400, this.height - 100);
        const potenciador = PowerUpFactory.createRandomPowerUp(this, x, y);
        potenciador.start();
        this.potenciadorGroup.add(potenciador);
    }

    update() {
        this.checkAchievements();
        this.player.update();
        this.plagaGroup.update();

        this.waterPoolManager.update();

        if (this.keyboard.UP.isDown) {
            this.player.top();
        } else if (this.keyboard.RIGHT.isDown) {
            this.player.right();
        } else if (this.keyboard.DOWN.isDown) {
            this.player.bottom();
        } else if (this.keyboard.LEFT.isDown) {
            this.player.left();
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

    dejarCoger() {
        this.plagaGroup.agregar(this, 1);
    }

}