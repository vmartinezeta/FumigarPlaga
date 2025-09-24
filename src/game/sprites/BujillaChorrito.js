import BaseEmitter from "./BaseEmitter";

export default class BujillaChorrito extends BaseEmitter {

    constructor(scene) {
        super(scene, "particle");
        this.damage = 10;
    }

    abrir() {
        this.emitParticles(Math.PI/6, 200);
    }
}