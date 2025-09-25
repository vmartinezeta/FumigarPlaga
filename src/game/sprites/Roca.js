import Recipiente from "./SuperSpray";


export default class Roca extends Recipiente {
    constructor(scene) {
        super(scene, 1, "particle");
        this.damage = 20;
    }

    lanzar() {
        this.emitParticles(Math.PI/6, 200);
        this.estaFuera = true;
    }

    soltar() {
        this.estaFuera = false;
    }

    isRoca() {
        return this.id === 1;
    }
}