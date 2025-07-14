import Phaser from "phaser"

export default class TanqueConAgua extends Phaser.GameObjects.Sprite {
    constructor(scene, origen, texture) {
        super(scene, origen.x, origen.y, texture);
        this.texture = texture
        this.setScale(1);
        this.setOrigin(1 / 2);
        scene.time.delayedCall(6000, this.onEliminar, [], this);    

        this.createAnimations(scene)
        this.play("fluir")

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        scene.tweens.add({
            targets: this,
            scaleX: { from: 1, to: 2 },
            scaleY: { from: 1, to: 2 },
            duration: 1000,
            ease: 'Back.out'
        })

    }

    onEliminar() {
        this.destroy()
    }

    createAnimations(scene) {
        if (scene.anims.exists("fluir")) return
        scene.anims.create({
            key: 'fluir',
            frames: scene.anims.generateFrameNumbers(this.texture, { start: 0, end: 4 }),
            frameRate: 12,
            repeat: -1
        });
    }
}