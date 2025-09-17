import Phaser from "phaser"
import Plaga from "./Plaga";

export default class PlagaGroup extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.total = 0;
        this.gameWidth = 4000;
        this.gameHeight = 600;
        this.agregar(scene, 20);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    agregar(scene, cantidad) {
        for (let i = 1; i <= cantidad; i++) {
            const x = Phaser.Math.Between(100, this.gameWidth - 100);
            const y = this.gameHeight - 200;
            const hembra = Math.floor(Math.random() * 2);
            this.add(new Plaga(scene, x, y, "rana", Boolean(hembra), true));
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