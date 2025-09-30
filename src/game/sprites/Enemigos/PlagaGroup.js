import Phaser from "phaser"
import Rana from "./Rana";
import RanaSaltarina from "./RanaSaltarina";

export default class PlagaGroup extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.total = 0;
        this.agregar(scene, 20);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    agregar(scene, cantidad) {
        for (let i = 1; i <= cantidad; i++) {
            const x = Phaser.Math.Between(100, this.scene.width - 100);
            const y = Phaser.Math.Between(scene.ymax + 20, this.scene.width - 20);
            const hembra = Math.floor(Math.random() * 2);
            const type = Math.floor(Math.random() * 3);
            this.add(new Rana(scene, x, y, "rana", Boolean(hembra), true));
            // if (type === 0) {
            // } else if (type === 1) {
                // this.add(new RanaSaltarina(scene, x, y, "rana", Boolean(hembra), true));
            // }
        }
    }

    addPlaga(plaga) {
        this.add(plaga)
        this.add(plaga)
    }

    estaVacio() {
        return this.countActive() === 0;
    }

    update() {
        this.getChildren().forEach(rana => {
            rana.updateHealthBar();
        });
    }

}