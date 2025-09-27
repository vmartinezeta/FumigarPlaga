import Potenciador from "./Potenciador";

export default class TanqueConAgua extends Potenciador {
    constructor(scene, x, y, imageKey) {
        super(scene, x, y, imageKey);

        this.play("fluir");
    }

    // onEliminar() {
    //     this.destroy()
    // }

    // existe(key) {
    //     return this.scene.anims.exists(key);
    // }

    // animate(scene) {
    //     if (!this.existe("fluir")) {
    //         scene.anims.create({
    //             key: 'fluir',
    //             frames: scene.anims.generateFrameNumbers(this.imageKey, { start: 0, end: 2 }),
    //             frameRate: 12,
    //             repeat: -1
    //         });
    //     }
    // }
}