import Phaser from "phaser";

export class BaseGameScene extends Phaser.Scene {

    constructor(key) {
        super(key);
        this.player = null;
        this.barraEstado = null;
        this.potenciadorGroup = null;
        this.keyboard = null;
        this.keys = null;
    }

    setup() {
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
        this.scene.start('MainMenu');
    }

    crearSuelo() { }


    // activarPotenciador() {}

    // aplicarPotenciador(player, potenciador){}
}