import Phaser from "phaser"

export default class Plano2D extends Phaser.GameObjects.Group {
    constructor(scene, config) {
        super(scene)
        this.config = config

        this.scene.physics.add.existing(this, true)
    }
}