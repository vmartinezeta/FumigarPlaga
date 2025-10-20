import Honda3Impacto from "../KitFierro/Honda3Impacto";
import PowerUp from "./PowerUp";


export default class MultiShoot extends PowerUp {
    constructor(scene, x, y, imageKey) {
        super(scene, x, y, imageKey, "weapon");
        this.fierro = new Honda3Impacto(scene);
        this.animate();
        this.flotar();
        this.play("nuevo-fierro")
    }

    animate() {
        if (!this.existe("nuevo-fierro")) {
            this.scene.anims.create({
                key: 'nuevo-fierro',
                frames: this.scene.anims.generateFrameNumbers(this.imageKey, { start: 0, end: 2 }),
                frameRate: 12,
                repeat: -1
            });
        }
    }
}