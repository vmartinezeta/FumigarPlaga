import Potenciador from "./Potenciador";

export default class TimeSlow extends Potenciador{
    constructor(scene, x,y, imageKey) {
        super(scene, x, y, imageKey);
        this.timegame = 5000;
    }

    applyEffect(rana) {
        const velocidad = rana.velocidad;
        rana.body.setVelocity(velocidad.x/2, velocidad.y/2);
        this.scene.time.delayedCall(this.timegame, this.reset, [rana], this);
    }

    reset(rana) {
        rana.body.setVelocity(rana.velocidad.x, rana.velocidad.y);
    }
    
}