import Phaser from "phaser";
import Mosquito from "./Mosquito";

export default class Mosquitos extends Phaser.GameObjects.Group {
    constructor(scene){
        super(scene);
        scene.physics.add.existing(this);
        this.agregar(scene, 20);
    }

    agregar(scene, cantidad) {
        for (let i = 1; i <= cantidad; i++) {
            const x = Phaser.Math.Between(100, this.scene.width - 100);
            const y = this.scene.height - 200;
            this.add(new Mosquito(scene, x, y, "mosquito"));
        }
    }

}