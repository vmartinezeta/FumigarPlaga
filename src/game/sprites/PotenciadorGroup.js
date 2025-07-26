import Phaser from "phaser"
import TanqueConAgua from "./TanqueConAgua"
import Vida from "./Vida"
import NotificacionTextual from "./NotificacionTextual";

export default class PotenciadorGroup extends Phaser.GameObjects.Group {
    constructor(scene, config) {
        super(scene);
        this.scene = scene;
        this.config = config;
        this.scene.physics.add.existing(this, true);
        this.alertas = [];
        this.primerasVecesAlerta = {
            tanque: 3,
            vida: 3,
        };
    }

    addPotenciador(potenciador) {
        if (potenciador instanceof TanqueConAgua && this.primerasVecesAlerta.tanque > 0) {
            this.createAlerta(this.scene.game.config.width / 2, 60, "Use la tecla A para suministrar el agua");
            this.primerasVecesAlerta.tanque--;
        }

        if (potenciador instanceof Vida && this.primerasVecesAlerta.vida > 0) {
            this.createAlerta(this.scene.game.config.width / 2, 60, "Use la tecla A para recoger la vida");
            this.primerasVecesAlerta.vida--;
        }

        this.add(potenciador)
    }


    createAlerta(x, y, texto) {
        const encontrado = this.alertas.find(alerta => alerta.getTexto() === texto);
        if (encontrado) {
            encontrado.finalizar();
        }

        const textual = new NotificacionTextual(this.scene, {
            x, y, texto
        }, notificacion => {
            const idx = this.alertas.findIndex( alerta => alerta.getTexto() === notificacion.getTexto());
            if (idx < 0) return;
            this.alertas.splice(idx, 1);
        });
        this.add(textual);
        this.alertas.push(textual);
        this.reordenar();
    }

    reordenar() {
        let anterior = null;
        for(const actual of this.alertas) {
            if (anterior) {
                actual.y = anterior.y + 60;
            } else {
                actual.y = 60;
            }
            anterior = actual;
        }
    }

}