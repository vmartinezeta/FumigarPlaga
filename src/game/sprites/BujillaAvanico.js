import SuperSpray from "../sprites/SuperSpray";

export default class BujillaAvanico extends SuperSpray {
    constructor(scene) {
        super(scene,"particle", Math.PI / 4, 2);
    }

    abrir() {
        this.createConcentratedSpray();
        this.estaFuera = true;
    }

}