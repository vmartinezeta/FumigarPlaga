import Phaser from "phaser";

export class BaseGameScene extends Phaser.Scene {

    constructor(key) {
        super(key);
    }

    crearSuelo() {}

    aplicarPotenciador(player, potenciador){}
}