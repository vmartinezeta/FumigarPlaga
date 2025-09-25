import Recipiente from "./SuperSpray";

export default class BujillaAvanico extends Recipiente {
    constructor(scene) {
        super(scene,3, "particle");
        this.damage = 2;
    }

    isAvanico() {
        return this.id === 3;
    }

    abrir() {
        this.emitParticles(Math.PI/4, 200);
        this.estaFuera = true;
    }
}