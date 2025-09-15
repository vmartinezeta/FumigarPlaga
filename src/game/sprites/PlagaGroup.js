import Phaser from "phaser"
import Plaga from "./Plaga";

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
        const {width, height} = scene.game.config;
        for (let i = 1; i <= cantidad; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const hembra = Math.floor(Math.random() * 2);
            this.add(new Plaga(scene, x, y, "rana", Boolean(hembra)));
        }
    }

    addPlaga(plaga) {
        this.add(plaga)
        this.add(plaga)
    }

    estaVacio() {
        return this.countActive() === 0;
    }
}