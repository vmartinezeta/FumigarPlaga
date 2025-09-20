import Phaser from "phaser";

export class NightScene extends Phaser.Scene {
    constructor() {
        super({ key: "NightScene" });
    }

    create() {
        // Configuración específica de noche
        this.skyColor = 0x0A0A2A; // Azul oscuro
        this.lightLevel = 0.3;
        this.createEnvironment();
    }

    createEnvironment() {
        const {width, height} = this.game.config;
        // Fondo nocturno
        this.add.rectangle(0, 0, width, height, this.skyColor);
        // Estrellas, luna, etc.
    }

    changeScene() {
        this.scene.start('MainMenu');
    }

}