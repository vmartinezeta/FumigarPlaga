import Phaser from "phaser";

export default class Pincho extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, imageKey) {
        super(scene, x, y, imageKey);
        this.scene = scene;
        this.imageKey = imageKey;
        this.setScale(1/3);
        this.setOrigin(1 / 2);
        this.setDepth(2);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(60,60);

        scene.tweens.add({
            targets: this,
            scaleX: { from: 1/4, to: 1/3 },
            scaleY: { from: 1/4, to: 1/3 },
            duration: 500,
            repeat: -1,
            yoyo: true,
            ease: 'Back.out'
        });
    }

}