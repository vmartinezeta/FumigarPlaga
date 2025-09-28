import Phaser from "phaser";
import Pincho from "./Pincho";

export default class HileraPincho extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);
        scene.physics.add.existing(this);
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(100, scene.width-100);
            const y = Phaser.Math.Between(320, scene.height-20);
            this.createPincho(scene, x, y);
        }
    }

    createPincho(scene, x, y) {
        this.add(new Pincho(scene, x, y, "pinchos"));
        this.add(new Pincho(scene, x + 10, y, "pinchos"));
        this.add(new Pincho(scene, x - 20, y, "pinchos"));
        this.add(new Pincho(scene, x - 10, y, "pinchos"));
        this.add(new Pincho(scene, x - 30, y, "pinchos"));
    }

}