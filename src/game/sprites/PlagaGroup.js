import Phaser from "phaser"

export default class PlagaGroup extends Phaser.GameObjects.Group {
    constructor(scene, children, config) {
        super(scene, children)
        this.scene = scene
        this.config = config
        this.total = 0
        this.cantidadMax = 6
        this.scene.physics.add.existing(this, true)
    }

    addPlaga(plaga) {
        this.add(plaga)
        this.add(plaga)
    }

}