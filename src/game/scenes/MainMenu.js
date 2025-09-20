import { EventBus } from '../EventBus'
import { Scene } from 'phaser'
import BasicAnimation from '../sprites/BasicAnimation';

export class MainMenu extends Scene {

    constructor() {
        super('MainMenu');
        this.animacion = null;
        this.letra = null;
        this.reactCallback = null;
        this.record = 0;
        this.animar = false;
    }

    init(data) {
        if (!data.record) return;
        if (data.record > this.record) {
            this.record = data.record;
            this.animar = true;
        }
    }


    createConfetti() {
        // Crear emitter con tiempo de vida automático
        this.confetti = this.add.particles(this.game.config.width/2, 300, 'confetti', {
            speed: { min: 100, max: 200 },
            scale: { start: 0.5, end: 0 },
            lifespan: 2000, // 2 segundos de vida
            quantity: 20,
            on: false
        });

        // Explotar y autodestruirse
        this.confetti.explode(2000); // Explota y se destruye después de 2 segundos
    }

    unlockAchievement(key) {
        // Lluvia de confeti (partículas)
        this.confetti = this.add.particles(this.game.config.width / 2, 160, 'particle', {
            speed: { min: 100, max: 200 },
            angle: { min: 60, max: 120 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 2000,
            quantity: 10,
            blendMode: 'ADD'
        });

        // Destello de luz
        this.flash = this.add.rectangle(400, 300, 800, 600, 0xffffff)
            .setAlpha(0)
            .setDepth(999);

        this.tweens.add({
            targets: this.flash,
            alpha: 0.3,
            duration: 200,
            yoyo: true,
            onComplete: () => this.flash.destroy()
        });
    }

    create() {
        this.animacion = new BasicAnimation(this, 350, 200, "FUMIGAR", 50);

        if (this.animar) {
            this.animar = false;
            this.createConfetti();
        }

        this.add.text(740, 100, 'Nuevo Record: ', {
            fontFamily: 'Arial Black', fontSize: 26, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // this.add.rectangle(900, 100, 100, 40, 0x0A0A2A);

        this.add.text(860, 100, this.record, {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 10,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }

    siguiente(letra) {
        this.reactCallback(letra);
    }

    changeScene(key) {
        this.scene.start(key);
        return this.scene.manager.getScene(key)
    }

    moverLetra(reactCallback) {
        this.reactCallback = reactCallback;
        this.animacion.iniciar(this.siguiente, this);
    }

    cancelAnimation() {
        this.animacion.cancelar();
        this.animacion.destroy();
    }

    reiniciar() {
        this.animacion.reiniciar(this.siguiente, this);
    }
}