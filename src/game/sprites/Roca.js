import BaseEmitter from "./BaseEmitter";

export default class Roca extends BaseEmitter {
    constructor(scene) {
        super(scene, "particle");
        this.damage = 20;
    }

    lanzar() {
        this.emitParticles(Math.PI/6, 200);
        this.estaFuera = true;
    }

    soltar() {
        this.estaFuera = false;
    }
}