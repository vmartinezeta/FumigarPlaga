import Rana from "./Rana";

// Rana camuflada (solo visible cuando se mueve)
export default class RanaCamuflada extends Rana {
    constructor(scene, x, y, imageKey, hembra, puedeCoger) {
        super(scene, x, y, imageKey, hembra, puedeCoger);
    }

    update() {
        this.setAlpha(this.body.velocity.x !== 0 ? 0.6 : 0.2);
    }
}