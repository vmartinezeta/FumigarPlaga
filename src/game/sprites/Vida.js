import Phaser from "phaser";
import Potenciador from "./Potenciador";

export default class Vida extends Potenciador {
    constructor(scene, x, y, imageKey) {
        super(scene, x, y, imageKey);

        this.body.setVelocity(Phaser.Math.Between(30, 40), Phaser.Math.Between(30, 40));
        this.body.setCollideWorldBounds(true);
        this.body.setBounce(1);
        // scene.tweens.add({
        //     targets: this,
        //     scaleX: { from: 0.5, to: 1.2 },
        //     scaleY: { from: 0.5, to: 1.2 },
        //     duration: 500,
        //     repeat: -1,
        //     yoyo: true,
        //     ease: 'Back.out'
        // });
        this.play("vida");
    }

    // onEliminar() {
    //     this.destroy()
    // }

    // existe(key) {
    //     return this.scene.anims.exists(key);
    // }

    // animate(scene) {
    //     if (!this.existe("vida")) {
    //         scene.anims.create({
    //             key: 'vida',
    //             frames: scene.anims.generateFrameNumbers(this.imageKey, { start: 0, end: 2 }),
    //             frameRate: 12,
    //             repeat: -1
    //         });
    //     }
    // }
}