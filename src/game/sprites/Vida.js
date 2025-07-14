import Phaser from "phaser";

export default class Vida extends Phaser.GameObjects.Sprite {
    constructor(scene, origen, texture) {
        super(scene, origen.x, origen.y, texture);
        this.texture = texture;
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.body.setVelocity(Phaser.Math.Between(30, 40), Phaser.Math.Between(30, 40))
        this.body.setBounce(1).setCollideWorldBounds(true)
        this.createAnimations(scene);
        this.play("vida")
        scene.time.delayedCall(6000, this.onEliminar, [], this)
    }

    createAnimations(scene) {
        if (scene.anims.exists("vida")) return
        scene.anims.create({
            key: 'vida',
            frames: scene.anims.generateFrameNumbers(this.texture, { start: 0, end: 2 }),
            frameRate: 12,
            repeat: -1
        })
    }

    onEliminar() {
        this.destroy()
    }

}