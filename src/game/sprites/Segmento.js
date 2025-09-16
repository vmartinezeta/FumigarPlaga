import Phaser from "phaser";

export default class Segmento extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture) {
        super(scene,x, y, texture);
        this.setOrigin(1/2);
        this.setScale(1);
        this.setVisible(false);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.allowGravity = false;
        this.body.immovable = true;
    }
}