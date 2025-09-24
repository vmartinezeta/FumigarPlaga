import BaseEmitter from "./BaseEmitter";

export default class Roca extends BaseEmitter {
    constructor(scene) {
        super(scene, "particle");
    }

    lanzar() {
        this.emitParticles();
        this.estaFuera = true;
    }

    soltar() {
        this.estaFuera = false;
    }
}