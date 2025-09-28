import PlayerSpray from "./PlayerSpray";

export default class BujillaAvanico extends PlayerSpray {
    constructor(scene, player) {
        super(scene,player, Math.PI / 4, 2);
    }

    abrir() {
        this.updateEmision();
        this.createParticle("particle");
    }

}