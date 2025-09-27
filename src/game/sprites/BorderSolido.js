import Phaser from "phaser";
import SegmentoVertical from "./SegmentoVertical";
import Segmento from "./Segmento";

export default class BorderSolido extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.AgregarSpriteVertical(2, scene.width, scene.ymax, "platform");
        this.AgregarSpriteHorizontal(24, 0, scene.height, "platform");
        this.AgregarSpriteVertical(2, 0, scene.ymax, "platform");
    }

    AgregarSpriteVertical(cantidad, x, y, imageKey) {
        for (let i = 0; i < cantidad; i++) {
            this.add(new SegmentoVertical(this.scene, x, i * 200 + y, imageKey));
        }
    }

    AgregarSpriteHorizontal(cantidad, x, y, imageKey) {
        for (let i = 0; i < cantidad; i++) {
            this.add(new Segmento(this.scene, i * 200 + x, y, imageKey));
        }
    }
}