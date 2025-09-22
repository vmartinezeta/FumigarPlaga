import { BaseGameScene } from "./BaseGameScene";
import NightPlayer from "../sprites/NightPlayer";

export class NightScene extends BaseGameScene {
    constructor() {
        super('NightScene');
    }

    create() {
        // Ambiente nocturno
        super.create();
        this.createNightEnvironment();
        // Player nocturno (con linterna)
        this.player = new NightPlayer(this, 100, 560, "player");

        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        // Sistema de iluminación
        // this.setupLightingSystem();
        
        // Potenciadores nocturnos
        this.createNightPowerups();
    }

    createNightEnvironment() {
        // Fondo nocturno
        // this.add.rectangle(400, 300, 800, 600, 0x0A0A2A);
        
        // Estrellas
        this.createStars();

        // Luna
        this.add.circle(650, 100, 30, 0xFFFFDD);
    }

    createStars() {}


    setupLightingSystem() {
        // Sistema de visibilidad limitada
        this.darknessOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000)
            .setAlpha(0.8)
            .setDepth(999);
        
        // Agujero de luz alrededor del player
        this.playerLightMask = this.createLightMask();
        this.darknessOverlay.setMask(this.playerLightMask);
    }

    createNightPowerups() {
        // Faroles estáticos que iluminan área
        this.lanterns = this.physics.add.staticGroup();
        
        // Potenciador de visión temporal
        this.nightVisionPowerup = this.physics.add.sprite(300, 300, 'night-vision')
            .setInteractive()
            .on('collected', () => {
                this.activateNightVision();
            });
    }

    update() {
        super.update();
        if (this.keyboard.up.isDown) {
            this.player.top();
        } else if (this.keyboard.right.isDown) {
            this.player.right();
        } else if (this.keyboard.down.isDown) {
            this.player.bottom();
        } else if (this.keyboard.left.isDown) {
            this.player.left();
        }
    }

}