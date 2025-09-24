import BaseEmitter from "./BaseEmitter";

export default class BujillaAvanico extends BaseEmitter {
    constructor(scene) {
        super(scene, "particle");
        this.damage = 2;
    }

    abrir() {
        this.emitParticles(Math.PI/4, 200);
        this.estaFuera = true;
    }
}