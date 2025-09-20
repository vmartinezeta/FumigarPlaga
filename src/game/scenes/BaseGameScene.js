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
        this.scene.start('MainMenu', {
            record: this.barraEstado.puntuacion
        });
    }

    // activarPotenciador() {}

    // aplicarPotenciador(player, potenciador){}
}