import Phaser from "phaser";
import { Punto } from "../classes/Punto";
import { Letra } from "../classes/Letra";
import Rana from "./Enemigos/Rana";


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
        this.plaga = new Rana(scene, x, y, "rana", false, false);
        this.plaga.rotar();
        this.plaga.habilitarBody(false);
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
        reactCallback.call(context, new Letra(this.plaga.getPunto(), actual, this.index, this.texto.length - 1));
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