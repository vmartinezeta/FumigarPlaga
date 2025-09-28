import PlayerSpray from "./PlayerSpray";

export default class Honda extends PlayerSpray {
    constructor(scene, player) {
        super(scene, player, Math.PI / 6, 20, 10);
        this.estaFuera = false;
    }

    lanzar() {
        if (this.vacio())return;
        this.updateEmision();
        this.createParticle("bomb", 1);
        this.estaFuera = true;
    }

    soltar() {
        this.estaFuera = false;
    }
}