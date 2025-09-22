import Rana from "./Rana";

// Rana saltarina (salta sobre obstáculos)
export default class RanaSaltarina extends Rana {
    constructor(scene, x, y, imageKey, hembra, puedeCoger) {
        super(scene,x, y, imageKey, hembra, puedeCoger);

        this.jump();
    }

    jump() {
        if (!this.body) return;
        this.body.setVelocityY(-160);
        this.scene.time.delayedCall(2000, this.jump, [], this);
    }
}