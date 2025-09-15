import Phaser from "phaser";
import Plaga from "./Plaga";
import { Punto } from "../classes/Punto";
import { Letra } from "../classes/Letra";

export default class BasicAnimation extends Phaser.GameObjects.Group {
    constructor(scene, x, y, texto, deltaX) {
        super(scene);
        this.scene = scene;
        this.index = 0;
        this.texto = texto;
        this.deltaX = deltaX;
        this.letra = null;
        scene.physics.add.existing(this, true);
        this.origen = new Punto(x, y);
        this.plaga = new Plaga(scene, x, y, "rana");
        this.plaga.rotar();
        this.plaga.habilitar(false);
        this.add(this.plaga);
        this.siguienteLetra = null;
    }

    cancelar() {
        if (!this.siguienteLetra) return;
        this.scene.time.removeEvent(this.siguienteLetra);
        this.index = 0;
        this.siguienteLetra = null;
        this.plaga.x = this.origen.x;
    }

    iniciar(reactCallback, context) {
        const actual = this.texto.charAt(this.index);
        reactCallback.call(context, new Letra(this.plaga.actual(), actual, this.index, this.texto.length - 1));
        this.plaga.x += this.deltaX;
        this.index++;
        if (this.index === this.texto.length) return;
        this.siguienteLetra = this.scene.time.delayedCall(1000, this.iniciar, [reactCallback, context], this);
    }

    reiniciar(reactCallback, context) {
        this.cancelar();
        this.iniciar(reactCallback, context);
    }

}