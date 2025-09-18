import Phaser from "phaser";

export default class Icono extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, id, imageKey, visible) {
        super(scene, x, y, imageKey);
        this.id = id;
        this.setOrigin(1 / 2);
        this.setTint(0x00ff00);
        this.setDepth(10);
        this.setScrollFactor(0);
        this.setVisible(visible);
        scene.add.existing(this);
    }
}