import Phaser from "phaser";

export class BaseGameScene extends Phaser.Scene {

    constructor(key) {
        super(key);
        this.player = null;
        this.barraEstado = null;
        this.potenciadorGroup = null;
        this.barraEstado = null;
        this.keyboard = null;
        this.keys = null;
    }

    // En tu BaseScene.js
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
    }

    changeScene() {
        this.sound.stopAll();
        let record = 0;
        if (this.barraEstado) {
            record = this.barraEstado.puntuacion;
        }
        this.scene.start('MainMenu', {
            record 
        });
    }

    // activarPotenciador() {}

    // aplicarPotenciador(player, potenciador){}
}