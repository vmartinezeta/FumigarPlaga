import SuperSpray from "./SuperSpray";

export default class PlayerSpray extends SuperSpray{
    constructor(scene, player, spread, damage, iterationCount=5) {
        super(scene, spread, damage, iterationCount);
        this.player = player;
    }

    updateEmision() {
        const offsetX = this.player.control.right() ? -30 : 30;
        this.emitX = this.player.x + offsetX;
        this.emitY = this.player.y - 15;
        this.baseAngle = this.player.control.right() ? 0 : Math.PI; // 180° o 0°
    }

}