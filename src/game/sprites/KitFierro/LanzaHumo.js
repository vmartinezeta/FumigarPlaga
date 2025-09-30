import PlayerSpray from "./PlayerSpray";

export default class LanzaHumo extends PlayerSpray{
    constructor(scene, player) {
        super(scene, player, Math.PI/30, 1, 100);
    }

    abrir() {
        this.updateEmision();
        const particle = this.createParticle("humo", .8);
        particle.body.setAllowGravity(false);
    }
}