import Phaser from "phaser";
import SegmentoVertical from "./SegmentoVertical";
import Segmento from "./Segmento";

export default class BorderSolido extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.AgregarSpriteHorizontal(24, 0, 300, "platform");
        this.AgregarSpriteVertical(2, 3584, 300, "platform");
        this.AgregarSpriteHorizontal(24, 0, 600, "platform");
        this.AgregarSpriteVertical(2, 0, 300, "platform");
        scene.add.existing(this);
        scene.physics.add.existing(this);
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