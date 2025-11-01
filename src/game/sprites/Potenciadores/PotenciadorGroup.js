import Phaser from "phaser"
import Vida from "./Vida"
import RecargaFierro from "./RecargaFierro";

export default class PotenciadorGroup extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        scene.physics.add.existing(this);
        this.alertas = [];
        this.primerasVecesAlerta = {
            tanque: 3,
            vida: 3,
        };
        this.y0 = 10;
        this.marginBottom = 60;
    }

    addPotenciador(potenciador) {
        if (potenciador instanceof RecargaFierro && this.primerasVecesAlerta.tanque > 0) {
            this.createAlerta(this.scene.game.config.width / 2, 60, "Use la tecla A para suministrar el agua", 600, 50);
            this.primerasVecesAlerta.tanque--;
        }

        if (potenciador instanceof Vida && this.primerasVecesAlerta.vida > 0) {
            this.createAlerta(this.scene.game.config.width / 2, 60, "Use la tecla A para recoger la vida", 600, 50);
            this.primerasVecesAlerta.vida--;
        }

        this.add(potenciador);
    }

    createAlerta(x, y, texto, width, height) {
        const encontrado = this.alertas.find(alerta => alerta.getTexto() === texto);
        if (encontrado) {
            encontrado.finalizar();
        }

        const textual = new NotificacionTextual(
            this.scene,
            texto,
            x, y,
            width,
            height,
            this.finalizar,
            this
        );
        this.add(textual);
        this.setDepth(1);
        this.alertas.push(textual);
        this.reordenar();
    }

    finalizar(notificacion) {
        const idx = this.alertas.findIndex(alerta => alerta.getTexto() === notificacion.getTexto());
        if (idx < 0) return;
        this.alertas.splice(idx, 1);
        this.reordenar();
    }

    reordenar() {
        let anterior = null;
        for (const actual of this.alertas) {
            if (anterior) {
                actual.y = anterior.y + this.marginBottom;
            } else {
                actual.y = this.y0;
            }
            anterior = actual;
        }
    }
    
}