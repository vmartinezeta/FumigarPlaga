import Phaser from "phaser"
import TanqueConAgua from "./TanqueConAgua"
import Vida from "./Vida"

export default class PotenciadorGroup extends Phaser.GameObjects.Group {
    constructor(scene, config) {
        super(scene);
        this.scene = scene;
        this.config = config;
        this.scene.physics.add.existing(this, true);
        this.id = 0
        this.alertas = [];
        this.primerasVecesAlerta = {
            tanque: 3,
            vida: 3,
        };
    }

    addPotenciador(potenciador) {
        if (potenciador instanceof TanqueConAgua && this.primerasVecesAlerta.tanque > 0) {
            this.createAlerta(this.scene.game.config.width / 2, 60, "Use la tecla A para suministrar el agua")
            this.primerasVecesAlerta.tanque--
            this.reordenar()
        }

        if (potenciador instanceof Vida && this.primerasVecesAlerta.vida > 0) {
            this.createAlerta(this.scene.game.config.width / 2, 60, "Use la tecla A para recoger la vida")
            this.primerasVecesAlerta.vida--
            this.reordenar()
        }

        this.add(potenciador)
    }

    createAlerta(x, y, texto) {
        const encontrado = this.alertas.find(alerta => alerta.text === texto)
        if (encontrado) {
            this.scene.time.removeEvent(encontrado.onEliminar)
            this.onEliminar(encontrado)
        }

        const forma = this.scene.add.graphics();
        forma.fillStyle(0x000000, 1);
        forma.fillRect(x-300, y-84, 600, 50);
        this.add(forma)

        const notificacion = this.scene.add.text(
            x, y, texto, {
            fontFamily: 'Arial Black', fontSize: 20, color: '#ffffff',
            stroke: '#000000', strokeThickness: 10,
            align: 'center'
        }).setOrigin(0.5).setDepth(100)
        notificacion.id = ++this.id;
        notificacion.forma = forma
        this.add(notificacion);
        notificacion.onEliminar = this.scene.time.delayedCall(4000, this.onEliminar, [notificacion], this);
        this.alertas.push(notificacion);

        this.scene.tweens.add({
            targets: notificacion,
            alpha: 0.5,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    onEliminar(notificacion) {
        this.remove(notificacion.forma, true, true)
        this.remove(notificacion, true, true)
        const idx = this.alertas.findIndex(alerta => alerta.id === notificacion.id)
        this.alertas.splice(idx, 1)
        this.reordenar()
    }

    reordenar() {
        let anterior = null
        for (const alerta of this.alertas) {
            if (anterior) {
                alerta.y = anterior.y + 60
                alerta.forma.y = alerta.y
            } else {
                alerta.y = 60
                alerta.forma.y = alerta.y
            }
            anterior = alerta
        }
    }
}