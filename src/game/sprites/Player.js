import Phaser from "phaser"

export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, origen, texture) {
        super(scene, origen.x, origen.y, texture)
        this.texture = texture
        this.vida = 10
        this.scene = scene
        scene.add.existing(this)
        scene.physics.world.enable(this)
        this.body.setCollideWorldBounds(true)

        this.setOrigin(1 / 2)
        this.setScale(1)

        this.createAnimations(scene)

        this.play('frontal')
        this.dx = 6
    }

    createAnimations(scene) {
        scene.anims.create({
            key: 'izq',
            frames: scene.anims.generateFrameNumbers(this.texture, { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        })

        scene.anims.create({
            key: 'frontal',
            frames: [{ key: "player", frame: 4 }],
            frameRate: 12,
            repeat: -1
        })

        scene.anims.create({
            key: 'der',
            frames: scene.anims.generateFrameNumbers(this.texture, { start: 5, end: 8 }),
            frameRate: 12,
            repeat: -1
        })

    }

    left() {
        this.play("izq")
        this.x -=this.dx
    }

    right() {
        this.play("der")
        this.x +=this.dx
    }

    top() {
        this.play("frontal")
        this.y -=this.dx
    }

    bottom() {
        this.play("frontal")
        this.y += this.dx
    }
}