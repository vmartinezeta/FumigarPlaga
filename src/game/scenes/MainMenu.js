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
        this.spray = null;
    }

    init(data) {
        if (!data.record) return;
        if (data.record > this.record) {
            this.record = data.record;
            this.createConfetti();
        }
    }

    createConfetti() {
        // Crear emitter con tiempo de vida automático
        this.confetti = this.add.particles(this.game.config.width / 2, 300, 'confetti', {
            speed: { min: 100, max: 200 },
            scale: { start: 0.5, end: 0 },
            lifespan: 2000, // 2 segundos de vida
            quantity: 20,
            on: false
        });

        // Explotar y autodestruirse
        this.confetti.explode(2000); // Explota y se destruye después de 2 segundos
    }

    create() {
        this.animacion = new BasicAnimation(this, 240, 220, "FUMIGAR", 65);
        // this.spray = new SuperSpray(this, Math.PI / 10);
        // this.spray.setAngle(Math.PI/8);
        // this.spray.setOrigen(330, 100);

        this.add.text(740, 100, 'Nuevo Record: ' + this.record, {
            fontFamily: 'Arial Black', fontSize: 26, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
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

    update() {
        // this.spray.createParticle("particle",.8);
    }
}