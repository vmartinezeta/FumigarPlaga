import Weapon from "./Weapon";

export default class Honda extends Weapon {
    constructor(scene, x, y) {
        super(scene, x, y, 'bomb', 'honda');
        this.fireRate = 300;
        this.damage = 15;
    }

    shoot(direction, playerX, playerY) {
        this.setPosition(playerX, playerY);
        this.setActive(true);
        this.setVisible(true);
        
        // Lógica de disparo específica de honda
        const speed = 300;
        this.body.setVelocity(
            direction === 'right' ? speed : -speed,
            0
        );
        
        // Auto-destrucción después de tiempo
        this.scene.time.delayedCall(2000, () => {
            this.setActive(false);
            this.setVisible(false);
        });
    }
}