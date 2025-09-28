import Rana from "./Rana";

// Rana saltarina (salta sobre obstáculos)
export default class RanaSaltarina extends Rana {
    constructor(scene, x, y, imageKey, hembra, puedeCoger) {
        super(scene,x, y, imageKey, hembra, puedeCoger);
        this.jump();
    }

    jump() {
        if (!this.body) return;
        this.body.setVelocityY(-300);
        this.body.setGravityY(200);
        this.scene.time.delayedCall(100, this.desplazar, [], this);
        this.scene.time.delayedCall(200, this.reset, [], this);
        this.scene.time.delayedCall(2000, this.jump, [], this);
    }

    desplazar() {
        if (!this.body) return;
        this.body.setVelocityX(20*this.velocidad.x);
    }

    reset() {
        if (!this.body) return;
        this.body.setVelocityX(this.velocidad.x);
    }

}