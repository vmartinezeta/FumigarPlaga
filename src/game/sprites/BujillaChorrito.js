import Recipiente from "./SuperSpray";

export default class BujillaChorrito extends Recipiente {

    constructor(scene) {
        super(scene,2, "particle");
        this.damage = 10;
    }

    isChorrito() {
        return this.id === 2;
    }

    abrir() {
        this.emitParticles(Math.PI/4, 200);
    }
}