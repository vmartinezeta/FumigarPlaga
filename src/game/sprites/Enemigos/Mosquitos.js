import Phaser from "phaser";
import Mosquito from "./Mosquito";

export default class Mosquitos extends Phaser.GameObjects.Group {
    constructor(scene, x, y){
        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;
        scene.physics.add.existing(this);
        this.agregar(scene, 20);
    }

    agregar(scene, cantidad) {
        for (let i = 1; i <= cantidad; i++) {
            const x = Phaser.Math.Between(100, scene.width - 100);
            const y = Phaser.Math.Between(scene.ymax+20, scene.height - 20);
            this.add(new Mosquito(scene, x, y, "mosquito"));
        }
    }

    update() {
        this.getChildren().forEach(mosquito =>{
            mosquito.updateSize(this.y, this.scene.game.config.height);
        });
    }
}