import Phaser from "phaser"
import TanqueConAgua from "./TanqueConAgua"
import Vida from "./Vida"

export default class PotenciadorGroup extends Phaser.GameObjects.Group {
    constructor(scene, config) {
        super(scene)
        this.scene = scene
        this.config = config
        this.scene.physics.add.existing(this, true)
        this.recientes = 0
        this.totalTanque = 0
        this.totalVida = 0
        this.alertas = []
    }

    addPotenciador(potenciador) {
        if (potenciador instanceof TanqueConAgua && this.totalTanque <1) {
            this.createAlerta(100, 60, "Use la tecla A para suministrar el agua")
            this.totalTanque ++
            this.actualizar()
        }

        if (potenciador instanceof Vida && this.totalVida < 1) {
            this.createAlerta(100, 60, "Use la tecla A para recoger la vida")
            this.totalVida ++ 
            this.actualizar()
        }

        this.add(potenciador)
    }

    createAlerta(x, y, texto) {
        const notificacion = this.scene.add.text(
            x, y, texto, {
            fontFamily: 'Arial Black', fontSize: 20, color: '#ffffff',
            stroke: '#000000', strokeThickness: 10,
            align: 'center'
        }).setOrigin(0).setDepth(100)
        this.add(notificacion)
        this.alertas.push(notificacion)
        this.scene.time.delayedCall(4000, this.onEliminar, [notificacion], this);

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