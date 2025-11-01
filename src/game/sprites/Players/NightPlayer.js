import Player from "../Players/Player";

export default class NightPlayer extends Player {
    constructor(scene, x, y, imageKey, vida) {
        super(scene, x, y, imageKey, vida);
        this.flashlight = scene.add.circle(this.x, this.y, 100, 0xFFDD99)
            .setAlpha(0.3)
            .setBlendMode(Phaser.BlendModes.ADD);
    }

    update() {
        this.flashlight.x = this.x;
        this.flashlight.y = this.y;
    }
}