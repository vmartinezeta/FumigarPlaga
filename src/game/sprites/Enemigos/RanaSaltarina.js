import Rana from "./Rana";

// Rana saltarina (salta sobre obstáculos)
export default class RanaSaltarina extends Rana {
    constructor(scene, x, y, imageKey, hembra, puedeCoger) {
        super(scene,x, y, imageKey, hembra, puedeCoger);
        this.body.setAllowGravity(true);
        this.body.setGravityY(200);
        this.setTint(0xff0000);        
        this.jump();
    }

    jump() {
        if (!this.body) return;
        if(this.body.touching.down) {
            this.body.setVelocityY(-600);
        }
        this.scene.time.delayedCall(100, this.desplazar, [], this);
        this.scene.time.delayedCall(200, this.reset, [], this);
        this.scene.time.delayedCall(2000, this.jump, [], this);
    }

    desplazar() {
        if (!this.body) return;
        const modulo = Math.abs(this.body.velocity.y);
        const vy = this.body.velocity.y / modulo;
        this.body.setVelocityX(60*this.velocidad.x);
    }

    reset() {
        if (!this.body) return;
        this.body.setVelocityX(this.velocidad.x);
    }

}