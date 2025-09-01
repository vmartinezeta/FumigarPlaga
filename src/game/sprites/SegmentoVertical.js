import Segmento from "./Segmento";

export default class SegmentoVertical extends Segmento{
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.angle = 90;
        this.body.setSize(this.height, this.width);
        scene.physics.add.existing(this);
    }
}