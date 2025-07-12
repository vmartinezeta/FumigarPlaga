import Phaser from "phaser"

export default class Potenciador extends Phaser.GameObjects.Sprite {
    constructor(scene, origen, texture) {
        super(scene, origen.x, origen.y, texture, 0); // Llamar al constructor de la clase padre (Sprite)
        this.texture = texture
        scene.add.existing(this)
        scene.physics.world.enable(this)

        this.setOrigin(1/2)
        this.setScale(2)
        this.createAnimations(scene)
        this.play("vida")

        scene.time.delayedCall(6000, this.onEliminar, [], this)
    }

    createAnimations(scene) {
        if(scene.anims.exists("vida")) return
        scene.anims.create({
            key: 'vida',
            frames: scene.anims.generateFrameNumbers(this.texture, { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        })
    }

    onEliminar() {
        this.destroy()
    }
}