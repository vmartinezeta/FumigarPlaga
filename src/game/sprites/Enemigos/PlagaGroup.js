import Phaser from "phaser"
import Rana from "./Rana";

export default class PlagaGroup extends Phaser.GameObjects.Group {
    constructor(scene, eventBus, x, y) {
        super(scene);
        this.scene = scene;
        this.eventBus = eventBus;
        this.total = 0;
        this.x = x;
        this.y = y;
        this.agregar(scene, 20);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    agregar(scene, cantidad, type="normal") {
        for (let i = 1; i <= cantidad; i++) {
            const x = Phaser.Math.Between(100, this.scene.width - 100);
            const y = Phaser.Math.Between(scene.ymax + 20, this.scene.width - 20);
            const hembra = Math.floor(Math.random() * 2);
            const rana = new Rana(scene, x, y, "rana", Boolean(hembra), true);
            rana.on("destroy", () => {
                this.eventBus.emit("scoreChanged", {puntuacion:rana.vidaMax});
            });
            this.add(rana);
        }
    }

    estaVacio() {
        return this.countActive() === 0;
    }

    update() {
        this.getChildren().forEach(rana => {
            if (rana instanceof Rana) {
                rana.updateSize(this.y, this.scene.game.config.height);
            }
        });
    }

}