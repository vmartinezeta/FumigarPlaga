import PlayerAndSpray from "./PlayerAndSpray";


export default class Roca extends PlayerAndSpray {
    constructor(scene, player, particles) {
        super(scene, player, particles, Math.PI / 6);
        this.estaFuera = false;
    }

    lanzar() {
        this.updateEmision();
        this.createConcentratedSpray("bomb", 1);
        this.estaFuera = true;
    }

    soltar() {
        this.estaFuera = false;
    }
}