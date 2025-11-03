import PowerUp from "./PowerUp";

export default class RecargaFierro extends PowerUp {
    constructor(scene, x, y, imageKey) {
        super(scene, x, y, imageKey, "recarga-fierro");
        this.color = 0xff00ff;
        this.flotar();
        this.play("recargar")
    }

    animate() {
        if (!this.existe("recargar")) {
            this.scene.anims.create({
                key: 'recargar',
                frames: this.scene.anims.generateFrameNumbers(this.imageKey, { start: 0, end: 2 }),
                frameRate: 12,
                repeat: -1
            });
        }
    }

    applyEffect(fierro) {
        fierro.reset();
        this.scene.eventBus.emit("statusBarChanged", { capacidad: fierro.capacidad });
    }

}