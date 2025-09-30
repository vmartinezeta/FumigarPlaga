import PlayerSpray from "./PlayerSpray";

export default class LanzaLlamas extends PlayerSpray {
    constructor(scene, player) {
        super(scene, player, Math.PI / 60, 5, 100);
    }

    abrir() {
        if (this.vacio()) return;
        this.updateEmision();
        this.iterationCount--;
        const particle = this.createParticle("fuego", .8);
        particle.setTint(0xffffff7a);
        particle.body.setAllowGravity(false);
    }
}