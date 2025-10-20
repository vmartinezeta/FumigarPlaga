import PowerUp from "./PowerUp";

export default class Invencibility extends PowerUp {
    constructor(scene, x, y, imageKey) {
        super(scene, x, y, imageKey);   
        this.timegame = 20000;     
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