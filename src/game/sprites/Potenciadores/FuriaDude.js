import Potenciador from "./Potenciador";

export default class FuriaDude extends Potenciador {
    constructor(scene, x, y, imageKey) {
        super(scene, x, y, imageKey);
        this.timegame = 10000;
    }

    applyEffect(player) {
        player.rapidez = 50;
        player.tieneFuria = true;
        this.scene.time.delayedCall(this.timegame, this.reset, [player], this);
    }

    reset(player) {
        player.tieneFuria = false;
        this.destroy();
    }
}