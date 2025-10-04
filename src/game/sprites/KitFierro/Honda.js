import Fierro from "./Fierro";

export default class Honda extends Fierro {
    constructor(scene) {
        super(scene, 0, 0, 'bomb', 'honda', 8);
        this.fireRate = 1500;
        this.damage = 15;
    }

    shoot(direction, playerX, playerY) {
        this.setPosition(playerX, playerY);
        this.setActive(true);
        this.setVisible(true);
        this.body.setEnable(true);

        // Lógica de disparo específica de honda
        const speed = 300;
        this.body.setVelocity(
            direction.right() ? speed : -speed,
            0
        );

        // Auto-destrucción después de tiempo
        this.scene.time.delayedCall(this.fireRate, () => {
            this.setActive(false);
            this.setVisible(false);
        });
    }
}