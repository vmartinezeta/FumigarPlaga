import Phaser from "phaser";
import PowerUp from "./PowerUp";

export default class Vida extends PowerUp {
    constructor(scene, x, y, imageKey) {
        super(scene, x, y, imageKey, "vida");
        this.color = 0x00ff00;
        this.body.setVelocity(Phaser.Math.Between(30, 40), Phaser.Math.Between(30, 40));
        this.body.setCollideWorldBounds(true);
        this.body.setBounce(1);
        this.play("vida");
    }

    animate() {
        if (!this.existe("vida")) {
            this.scene.anims.create({
                key: 'vida',
                frames: this.scene.anims.generateFrameNumbers(this.imageKey, { start: 0, end: 2 }),
                frameRate: 12,
                repeat: -1
            });
        }
    }

    applyEffect(player) {
        player.vida += 2;
    }

}