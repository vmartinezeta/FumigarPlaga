import PowerUp from "./PowerUp";

export default class FuriaDude extends PowerUp {
    constructor(scene, x, y, imageKey) {
        super(scene, x, y, imageKey, "furia");
        this.timegame = 10000;
        this.color = 0xff4500;
        this.animate();
        this.flotar();
        this.play("furia");
    }

    animate() {
        if (!this.existe("furia")) {
            this.scene.anims.create({
                key: 'furia',
                frames: this.scene.anims.generateFrameNumbers(this.imageKey, { start: 0, end: 2 }),
                frameRate: 12,
                repeat: -1
            });
        }
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