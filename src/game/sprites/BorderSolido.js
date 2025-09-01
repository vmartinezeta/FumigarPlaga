import Phaser from "phaser";
import SegmentoVertical from "./SegmentoVertical";
import Segmento from "./Segmento";

export default class BorderSolido extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.AgregarSpriteHorizontal(6, 0, 0, "platform");
        this.AgregarSpriteVertical(4, 1024, 0, "platform");
        this.AgregarSpriteHorizontal(6, 0, 600, "platform");
        this.AgregarSpriteVertical(4, 0, 0, "platform");
    }

    AgregarSpriteVertical(cantidad, x, y, texture) {
        for (let i = 0; i < cantidad; i++) {
            this.add(new SegmentoVertical(this.scene, x, i * 200 + y, texture));
        }
    }

    AgregarSpriteHorizontal(cantidad, x, y, texture) {
        for (let i = 0; i < cantidad; i++) {
            this.add(new Segmento(this.scene, i * 200 + x, y, texture));
        }
    }
}