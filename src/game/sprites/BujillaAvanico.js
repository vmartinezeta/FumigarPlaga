import PlayerAndSpray from "./PlayerAndSpray";

export default class BujillaAvanico extends PlayerAndSpray {
    constructor(scene, player, particles) {
        super(scene,player, particles, Math.PI / 4, 2);
    }

    abrir() {
        this.updateEmision();
        this.createConcentratedSpray();
        this.estaFuera = true;
    }

}