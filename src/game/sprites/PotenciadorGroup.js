import Phaser from "phaser"
import TanqueConAgua from "./TanqueConAgua"
import Vida from "./Vida"

export default class PotenciadorGroup extends Phaser.GameObjects.Group {
    constructor(scene, config) {
        super(scene);
        this.scene = scene;
        this.config = config;
        this.scene.physics.add.existing(this, true);
        this.recientes = 0;
        this.id = 0
        this.alertas = [];
        this.primerasVecesAlerta = {
            tanque:0,
            tanqueMax: 3,
            vida: 0,
            vidaMax: 3
        };
    }

    addPotenciador(potenciador) {
        if (potenciador instanceof TanqueConAgua && this.primerasVecesAlerta.tanque < this.primerasVecesAlerta.tanqueMax) {
            this.createAlerta(100, 60, "Use la tecla A para suministrar el agua")
            this.primerasVecesAlerta.tanque ++
            this.actualizar()
        }

        if (potenciador instanceof Vida && this.primerasVecesAlerta.vida < 1) {
            this.createAlerta(100, 60, "Use la tecla A para recoger la vida")
            this.primerasVecesAlerta.vida ++
            this.actualizar()
        }

        this.add(potenciador)
    }

    createAlerta(x, y, texto) {
        this.id ++
        const duplicado = this.alertas.find(alerta => alerta.text ===texto)
        if (duplicado) {
            this.scene.time.removeEvent(duplicado.evento)
            this.onEliminar(duplicado)
        }

        const notificacion = this.scene.add.text(
            x, y, texto, {
            fontFamily: 'Arial Black', fontSize: 20, color: '#ffffff',
            stroke: '#000000', strokeThickness: 10,
            align: 'center'
        }).setOrigin(0).setDepth(100)
        notificacion.id = this.id
        this.add(notificacion)
        const evento = this.scene.time.delayedCall(4000, this.onEliminar, [notificacion], this);
        notificacion.evento = evento
        this.alertas.push(notificacion)

        this.scene.tweens.add({
            targets: notificacion,
            alpha: 0.5,
            duration: 500,
            yoyo: true,
            repeat: -1          
        });
    }

    onEliminar(notificacion) {
        this.remove(notificacion, true, true)
        const idx = this.alertas.findIndex(alerta => alerta.id === notificacion.id)
        this.alertas.splice(idx, 1)
    }

    actualizar() {
        let anterior = null
        for(const alerta of this.alertas) {
            if (anterior) {
                alerta.y = anterior.y + 60
            }
            anterior = alerta
        }
    }
}