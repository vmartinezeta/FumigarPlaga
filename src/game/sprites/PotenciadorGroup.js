import Phaser from "phaser"

export default class PotenciadorGroup extends Phaser.GameObjects.Group {
    constructor(scene, config) {
        super(scene)
        this.scene = scene
        this.config = config
        this.scene.physics.add.existing(this, true)
    }

    addPotenciador(potenciador) {
        this.add(potenciador)
    }
}